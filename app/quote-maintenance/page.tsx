// app/quote-maintenance/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { MaintenanceQuote } from "@/types/maintenance";
import { Loader2, Search } from "lucide-react";
import { MaintenanceQuoteCard } from '@/components/maintenance/MaintenanceQuoteCard';

export default function MaintenanceQuotesPage() {
  const [maintenanceQuotes, setMaintenanceQuotes] = useState<MaintenanceQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useKindeAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMaintenanceQuotes();
    }
  }, [isAuthenticated]);

  const fetchMaintenanceQuotes = async () => {
    try {
      const response = await fetch('/api/maintenance');
      if (!response.ok) throw new Error('Failed to fetch maintenance quotes');
      const data = await response.json();
      setMaintenanceQuotes(data);
    } catch (error) {
      console.error('Error fetching maintenance quotes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch maintenance quotes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete maintenance quote');
      setMaintenanceQuotes(maintenanceQuotes.filter(quote => quote.id !== id));
      toast({
        title: "Success",
        description: "Maintenance quote deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting maintenance quote:', error);
      toast({
        title: "Error",
        description: "Failed to delete maintenance quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredQuotes = maintenanceQuotes.filter(quote =>
    quote.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
      <h1 className="text-3xl font-bold mb-6 text-lienzo">Maintenance Quotes</h1>
      <div className="mb-6 flex items-center">
        <Search className="w-5 h-5 mr-2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name, email or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((quote) => (
          <MaintenanceQuoteCard
            key={quote.id}
            quote={quote}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {filteredQuotes.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No maintenance quotes found.
        </div>
      )}
    </div>
  );
}