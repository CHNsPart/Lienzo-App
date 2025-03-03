// app/api/support/tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { SUPPORT_TICKET_STATUS } from "@/lib/constants/support";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user from database to check role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Common include object for relationships
    const includeRelations = {
      documents: {
        include: {
          document: true
        }
      },
      supportUsers: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      }
    };

    let tickets;

    // If admin, get all tickets
    // If support user, only get assigned tickets
    if (await isAdmin(user)) {
      tickets = await prisma.supportTicket.findMany({
        include: includeRelations,
        orderBy: { createdAt: 'desc' }
      });
    } else if (dbUser.role === 'SUPPORT') {
      tickets = await prisma.supportTicket.findMany({
        where: {
          supportUsers: {
            some: {
              userId: user.id
            }
          }
        },
        include: includeRelations,
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Only allow admins to create tickets
  if (!user || !(await isAdmin(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      customerName, 
      companyName, 
      companyAddress, 
      meetDate, 
      meetTime,
      documentIds,  // Array of InstructionDocument IDs
      supportUserIds  // Array of Support User IDs
    } = body;

    // Validate required fields
    if (!customerName || !companyName || !companyAddress || !meetDate || !meetTime) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Validate documents exist
    if (documentIds?.length) {
      const documents = await prisma.instructionDocument.findMany({
        where: { id: { in: documentIds } }
      });
      if (documents.length !== documentIds.length) {
        return NextResponse.json(
          { error: "One or more documents not found" },
          { status: 400 }
        );
      }
    }

    // Validate support users exist and have SUPPORT role
    if (supportUserIds?.length) {
      const supportUsers = await prisma.user.findMany({
        where: { 
          id: { in: supportUserIds },
          role: 'SUPPORT'
        }
      });
      if (supportUsers.length !== supportUserIds.length) {
        return NextResponse.json(
          { error: "One or more support users not found or invalid role" },
          { status: 400 }
        );
      }
    }

    // Create ticket with relationships
    const ticket = await prisma.supportTicket.create({
      data: {
        customerName,
        companyName,
        companyAddress,
        meetDate: new Date(meetDate),
        meetTime,
        status: SUPPORT_TICKET_STATUS.OPEN,
        // Create document relationships
        documents: {
          create: documentIds?.map((documentId: string) => ({
            documentId,
          })) || []
        },
        // Create support user relationships
        supportUsers: {
          create: supportUserIds?.map((userId: string) => ({
            userId,
          })) || []
        }
      },
      include: {
        documents: {
          include: {
            document: true
          }
        },
        supportUsers: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Only allow admins to delete tickets
  if (!user || !(await isAdmin(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Delete relationships first
    await prisma.ticketsOnDocuments.deleteMany({
      where: { ticketId: id }
    });

    await prisma.ticketsOnUsers.deleteMany({
      where: { ticketId: id }
    });

    // Then delete the ticket
    await prisma.supportTicket.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}