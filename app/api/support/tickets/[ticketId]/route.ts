// app/api/support/tickets/[ticketId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { SUPPORT_TICKET_STATUS } from "@/lib/constants/support";
import { TicketUpdateData } from "@/types/support";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId },
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

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if user is admin or assigned support user
    const isUserAdmin = await isAdmin(user);
    const isAssignedSupport = ticket.supportUsers.some(su => su.user.id === user.id);

    if (!isUserAdmin && !isAssignedSupport) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch ticket to check permissions
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId },
      include: {
        supportUsers: {
          include: {
            user: true
          }
        }
      }
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if user is admin or assigned support user
    const isUserAdmin = await isAdmin(user);
    const isAssignedSupport = existingTicket.supportUsers.some(
      su => su.user.id === user.id
    );

    if (!isUserAdmin && !isAssignedSupport) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData: TicketUpdateData = await request.json();

    // Start a transaction for all updates
    const updatedTicket = await prisma.$transaction(async (tx) => {
      // 1. Basic ticket information update
      const basicUpdate = {
        ...(updateData.customerName && { customerName: updateData.customerName }),
        ...(updateData.companyName && { companyName: updateData.companyName }),
        ...(updateData.companyAddress && { companyAddress: updateData.companyAddress }),
        ...(updateData.meetDate && { meetDate: new Date(updateData.meetDate) }),
        ...(updateData.meetTime && { meetTime: updateData.meetTime }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.rescheduledDate !== undefined && { 
          rescheduledDate: updateData.rescheduledDate ? new Date(updateData.rescheduledDate) : null 
        }),
        ...(updateData.rescheduledTime !== undefined && { 
          rescheduledTime: updateData.rescheduledTime 
        })
      };

      // 2. Document updates
      if (updateData.documentsToRemove?.length) {
        await tx.ticketsOnDocuments.deleteMany({
          where: {
            ticketId: params.ticketId,
            documentId: { in: updateData.documentsToRemove }
          }
        });
      }

      if (updateData.documentsToAdd?.length) {
        await tx.ticketsOnDocuments.createMany({
          data: updateData.documentsToAdd.map(documentId => ({
            ticketId: params.ticketId,
            documentId
          }))
        });
      }

      // 3. Support team updates
      if (updateData.supportUsersToRemove?.length) {
        await tx.ticketsOnUsers.deleteMany({
          where: {
            ticketId: params.ticketId,
            userId: { in: updateData.supportUsersToRemove }
          }
        });
      }

      if (updateData.supportUsersToAdd?.length) {
        await tx.ticketsOnUsers.createMany({
          data: updateData.supportUsersToAdd.map(userId => ({
            ticketId: params.ticketId,
            userId
          }))
        });
      }

      // 4. Update the ticket with basic info and fetch the updated version
      return await tx.supportTicket.update({
        where: { id: params.ticketId },
        data: basicUpdate,
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
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // Only admins can delete tickets
    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete relationships first
    await prisma.ticketsOnDocuments.deleteMany({
      where: { ticketId: params.ticketId }
    });

    await prisma.ticketsOnUsers.deleteMany({
      where: { ticketId: params.ticketId }
    });

    // Then delete the ticket
    await prisma.supportTicket.delete({
      where: { id: params.ticketId }
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