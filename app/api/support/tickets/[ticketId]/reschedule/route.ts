// app/api/support/tickets/[ticketId]/reschedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { SUPPORT_TICKET_STATUS } from "@/lib/constants/support";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId } = params;
    const { rescheduledDate, rescheduledTime } = await req.json();
    
    // Validate inputs
    if (!rescheduledDate || !rescheduledTime) {
      return NextResponse.json(
        { error: "Both date and time are required" },
        { status: 400 }
      );
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(rescheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return NextResponse.json(
        { error: "Please select a future date" },
        { status: 400 }
      );
    }

    // Get the ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      select: { 
        customerName: true,
        status: true
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }
    
    // Verify the user is the customer for this ticket
    const fullName = `${user.given_name} ${user.family_name}`.trim();
    if (ticket.customerName !== fullName) {
      return NextResponse.json(
        { error: "You can only reschedule your own tickets" },
        { status: 403 }
      );
    }
    
    // Don't allow rescheduling resolved tickets
    if (ticket.status === SUPPORT_TICKET_STATUS.RESOLVED) {
      return NextResponse.json(
        { error: "Cannot reschedule a resolved ticket" },
        { status: 400 }
      );
    }

    // Update the ticket with rescheduled date/time
    // For regular users, we'll set the status to RESCHEDULED
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        rescheduledDate: new Date(rescheduledDate),
        rescheduledTime: rescheduledTime,
        status: SUPPORT_TICKET_STATUS.RESCHEDULED
      }
    });

    return NextResponse.json({ 
      success: true,
      message: "Reschedule request processed successfully",
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Error processing reschedule request:', error);
    return NextResponse.json(
      { error: 'Failed to process reschedule request', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}