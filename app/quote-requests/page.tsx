'use client'

import { useState, useEffect } from 'react';
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuoteRequest } from "@/types/quoteRequest";
import { Loader2, Search } from "lucide-react";
import { QuoteRequestCard } from '@/components/getQuotes/QuoteRequestCard';

export default function QuoteRequestsPage() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useKindeAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuoteRequests();
    }
  }, [isAuthenticated]);

  const fetchQuoteRequests = async () => {
    try {
      const response = await fetch('/api/quote-requests');
      if (!response.ok) throw new Error('Failed to fetch quote requests');
      const data = await response.json();
      setQuoteRequests(data);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quote requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/quote-requests/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete quote request');
      setQuoteRequests(quoteRequests.filter(request => request.id !== id));
      toast({
        title: "Success",
        description: "Quote request deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting quote request:', error);
      toast({
        title: "Error",
        description: "Failed to delete quote request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredQuoteRequests = quoteRequests.filter(request =>
    request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-lienzo" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-lienzo">Quote Requests</h1>
      <div className="mb-6 flex items-center">
        <Search className="w-5 h-5 mr-2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuoteRequests.map((quoteRequest) => (
          <QuoteRequestCard
            key={quoteRequest.id}
            quoteRequest={quoteRequest}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {filteredQuoteRequests.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No quote requests found.
        </div>
      )}
    </div>
  );
}