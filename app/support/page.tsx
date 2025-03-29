"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarPlus, Headset, Loader2 } from "lucide-react";
import { SupportTicketDetails, TicketStatus } from "@/types/support";
import { SUPPORT_FILTERS } from "@/lib/constants/support";
import CreateTicketModal from '@/components/support/CreateTicketModal';
import UserTicketCreateModal from '@/components/support/UserTicketCreateModal';
import TicketList from '@/components/support/TicketList';
import TicketFilters from '@/components/support/TicketFilters';
import { useToast } from "@/hooks/use-toast";
import { Roles } from "@/lib/roles";
import { Card, CardContent } from "@/components/ui/card";

interface UserData {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicketDetails[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>(SUPPORT_FILTERS.ALL);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/support/tickets');
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const data = await response.json();
      setTickets(data || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      });
      setTickets([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refreshTrigger]);

  const handleRefreshNeeded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        // Fetch user claims first
        const userResponse = await fetch('/api/user-claims');
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        setUserRole(userData.role);
        setUserData(userData);

        // Then fetch tickets
        await fetchTickets();
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [toast]);

  const handleTicketCreated = async () => {
    setIsLoading(true);
    await fetchTickets();
    setIsCreateModalOpen(false);
    setIsLoading(false);
    toast({
      title: "Success",
      description: "Ticket created successfully",
    });
  };

  const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
    // Implementation for status change
    console.log('Status change:', ticketId, status);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isAdminOrSupport = userRole === Roles.ADMIN || userRole === Roles.SUPPORT;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#F26B60] hover:bg-[#F26B60]/90"
        >
          {userRole === Roles.ADMIN ? (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Ticket
            </>
          ) : (
            <>
              <CalendarPlus className="w-4 h-4 mr-2" />
              Request Support
            </>
          )}
        </Button>
      </div>

      {isAdminOrSupport ? (
        <>
          <TicketFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <TicketList
            tickets={tickets}
            isLoading={isLoading}
            activeFilter={activeFilter}
            onStatusChange={handleStatusChange}
            onRefreshNeeded={handleRefreshNeeded}
          />
        </>
      ) : (
        <>
          {tickets.length > 0 ? (
            <>
              <h2 className="text-lg font-medium mb-4">Your Support Requests</h2>
              <TicketList
                tickets={tickets}
                isLoading={isLoading}
                activeFilter={activeFilter}
                onStatusChange={handleStatusChange}
                onRefreshNeeded={handleRefreshNeeded}
              />
            </>
          ) : (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Headset className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Support Requests Yet</h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any support requests yet. Click the button above to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {userRole === Roles.ADMIN ? (
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTicketCreated={handleTicketCreated}
        />
      ) : (
        <UserTicketCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTicketCreated={handleTicketCreated}
          userData={userData}
        />
      )}
    </div>
  );
}