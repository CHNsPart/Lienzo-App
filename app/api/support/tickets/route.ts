// app/api/support/tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { SUPPORT_TICKET_STATUS } from "@/lib/constants/support";

// Function to auto-assign a support team member using load balancing
async function autoAssignSupportMember(): Promise<string | null> {
  try {
    // Get all support users
    const supportUsers = await prisma.user.findMany({
      where: { role: 'SUPPORT' },
      select: { id: true }
    });

    if (supportUsers.length === 0) {
      console.error("No support users found in the system");
      return null;
    }

    // Count active tickets for each support user
    const supportUserLoads = await Promise.all(
      supportUsers.map(async (user) => {
        const activeTicketsCount = await prisma.ticketsOnUsers.count({
          where: { 
            userId: user.id,
            ticket: { 
              status: { in: [SUPPORT_TICKET_STATUS.OPEN, SUPPORT_TICKET_STATUS.RESCHEDULED] } 
            }
          }
        });
        
        return {
          userId: user.id,
          activeTicketsCount
        };
      })
    );

    // Sort by ticket count (ascending)
    supportUserLoads.sort((a, b) => a.activeTicketsCount - b.activeTicketsCount);

    // Find all users with the minimum load
    const minLoad = supportUserLoads[0].activeTicketsCount;
    const leastLoadedUsers = supportUserLoads.filter(user => user.activeTicketsCount === minLoad);

    // Randomly select one of the least loaded users
    const selectedUserIndex = Math.floor(Math.random() * leastLoadedUsers.length);
    return leastLoadedUsers[selectedUserIndex].userId;
  } catch (error) {
    console.error("Error auto-assigning support member:", error);
    return null;
  }
}

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    // If regular user, get only their tickets
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
      // For regular users, find tickets where they are the customer
      // This assumes customerName contains their full name
      const fullName = `${user.given_name} ${user.family_name}`.trim();
      
      tickets = await prisma.supportTicket.findMany({
        where: {
          customerName: fullName
        },
        include: includeRelations,
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // All users can create tickets now, not just admins
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      customerName, 
      companyName, 
      companyAddress, 
      meetDate, 
      meetTime,
      documentIds,  // Optional now
      supportUserIds  // Optional now
    } = body;

    // Validate required fields
    if (!customerName || !companyName || !companyAddress || !meetDate || !meetTime) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const isAdminUser = await isAdmin(user);
    
    // If documentIds are provided (admin use case), validate they exist
    let validatedDocumentIds: string[] = [];
    if (isAdminUser && documentIds?.length) {
      const documents = await prisma.instructionDocument.findMany({
        where: { id: { in: documentIds } }
      });
      
      if (documents.length !== documentIds.length) {
        return NextResponse.json(
          { error: "One or more documents not found" },
          { status: 400 }
        );
      }
      
      validatedDocumentIds = documentIds;
    }

    // Determine support users based on who's creating the ticket
    let validatedSupportUserIds: string[] = [];
    
    if (isAdminUser && supportUserIds?.length) {
      // Admin provided specific support users
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
      
      validatedSupportUserIds = supportUserIds;
    } else {
      // Auto-assign a support user
      const autoAssignedUserId = await autoAssignSupportMember();
      
      if (!autoAssignedUserId) {
        return NextResponse.json(
          { error: "Failed to assign a support team member. Please try again." },
          { status: 500 }
        );
      }
      
      validatedSupportUserIds = [autoAssignedUserId];
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
        // Create document relationships if any
        documents: {
          create: validatedDocumentIds.map((documentId: string) => ({
            documentId,
          }))
        },
        // Create support user relationships
        supportUsers: {
          create: validatedSupportUserIds.map((userId: string) => ({
            userId,
          }))
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
      { error: 'Failed to create ticket', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // Only allow admins to delete tickets
    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      { error: 'Failed to delete ticket', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}