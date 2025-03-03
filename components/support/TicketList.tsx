// "use client";

// import { useState, useEffect } from 'react';
// import { Loader2 } from "lucide-react";
// import { SupportTicketDetails, TicketStatus } from "@/types/support";
// import { SUPPORT_FILTERS } from "@/lib/constants/support";
// import { useToast } from "@/hooks/use-toast";
// import TicketCard from "./TicketCard";
// import TicketDetailsModal from './TicketDetailsModal';

// interface TicketListProps {
//   tickets: SupportTicketDetails[];
//   isLoading: boolean;
//   activeFilter: string;
//   onStatusChange: (ticketId: string, status: TicketStatus) => void;
// }

// interface UserInfo {
//   id: string;
//   role: string;
// }

// export default function TicketList({ 
//   tickets = [], // Provide default empty array
//   isLoading, 
//   activeFilter,
// }: TicketListProps) {
//   const [selectedTicket, setSelectedTicket] = useState<SupportTicketDetails | null>(null);
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
//   const [isLoadingUser, setIsLoadingUser] = useState(true);
//   const { toast } = useToast();

//   // Fetch current user info
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const response = await fetch('/api/user-claims');
//         if (!response.ok) throw new Error('Failed to fetch user info');
//         const data = await response.json();
//         setUserInfo({
//           id: data.id,
//           role: data.role
//         });
//       } catch (error) {
//         console.error('Error fetching user info:', error);
//         toast({
//           title: "Error",
//           description: "Failed to load user information",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoadingUser(false);
//       }
//     };

//     fetchUserInfo();
//   }, [toast]);

//   // Safe check for tickets array
//   const safeTickets = Array.isArray(tickets) ? tickets : [];

//   // Filter tickets based on active filter
//   const filteredTickets = safeTickets.filter(ticket => {
//     if (activeFilter === SUPPORT_FILTERS.ALL) return true;
//     return ticket.status === activeFilter;
//   });

//   if (isLoading || isLoadingUser) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin text-lienzo" />
//       </div>
//     );
//   }

//   if (!userInfo) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         Unable to load user information. Please try again later.
//       </div>
//     );
//   }

//   if (!filteredTickets.length) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         No tickets found for the selected filter.
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//         {filteredTickets.map((ticket) => (
//           <TicketCard
//             key={ticket.id}
//             ticket={ticket}
//             onClick={setSelectedTicket}
//             userRole={userInfo.role}
//             userId={userInfo.id}
//           />
//         ))}
//       </div>

//       {selectedTicket && userInfo && (
//         <TicketDetailsModal
//           ticket={selectedTicket}
//           onClose={() => setSelectedTicket(null)}
//           userRole={userInfo.role}
//           userId={userInfo.id}
//         />
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { SupportTicketDetails, TicketStatus } from "@/types/support";
import { SUPPORT_FILTERS } from "@/lib/constants/support";
import { useToast } from "@/hooks/use-toast";
import TicketCard from "./TicketCard";
import TicketDetailsModal from './TicketDetailsModal';

interface TicketListProps {
  tickets: SupportTicketDetails[];
  isLoading: boolean;
  activeFilter: string;
  onStatusChange: (ticketId: string, status: TicketStatus) => void;
  onRefreshNeeded: () => void;  // New prop for handling refreshes
}

interface UserInfo {
  id: string;
  role: string;
}

export default function TicketList({ 
  tickets = [], // Provide default empty array
  isLoading, 
  activeFilter,
  onRefreshNeeded,  // Add this to props
}: TicketListProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketDetails | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { toast } = useToast();

  // Fetch current user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user-claims');
        if (!response.ok) throw new Error('Failed to fetch user info');
        const data = await response.json();
        setUserInfo({
          id: data.id,
          role: data.role
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast({
          title: "Error",
          description: "Failed to load user information",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, [toast]);

  // Handle ticket update/delete
  const handleTicketChange = () => {
    setSelectedTicket(null); // Close the modal
    onRefreshNeeded(); // Trigger refresh in parent component
  };

  // Safe check for tickets array
  const safeTickets = Array.isArray(tickets) ? tickets : [];

  // Filter tickets based on active filter
  const filteredTickets = safeTickets.filter(ticket => {
    if (activeFilter === SUPPORT_FILTERS.ALL) return true;
    return ticket.status === activeFilter;
  });

  if (isLoading || isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-lienzo" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="text-center py-12 text-gray-500">
        Unable to load user information. Please try again later.
      </div>
    );
  }

  if (!filteredTickets.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No tickets found for the selected filter.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={setSelectedTicket}
            userRole={userInfo.role}
            userId={userInfo.id}
          />
        ))}
      </div>

      {selectedTicket && userInfo && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          userRole={userInfo.role}
          userId={userInfo.id}
          onTicketChange={handleTicketChange}  // Add this prop
        />
      )}
    </>
  );
}