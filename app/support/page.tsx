"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SupportTicketDetails, TicketStatus } from "@/types/support";
import { SUPPORT_FILTERS } from "@/lib/constants/support";
import CreateTicketModal from '@/components/support/CreateTicketModal';
import TicketList from '@/components/support/TicketList';
import TicketFilters from '@/components/support/TicketFilters';
import { useToast } from "@/hooks/use-toast";
import { Roles } from "@/lib/roles";

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicketDetails[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>(SUPPORT_FILTERS.ALL);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        {userRole === Roles.ADMIN && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#F26B60] hover:bg-[#F26B60]/90"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        )}
      </div>

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

      {userRole === Roles.ADMIN && (
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTicketCreated={handleTicketCreated}
        />
      )}
    </div>
  );
}