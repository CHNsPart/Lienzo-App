// components/maintenance/MaintenanceQuoteCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { MaintenanceQuote } from "@/types/maintenance";
import { Badge } from "@/components/ui/badge";

interface MaintenanceQuoteCardProps {
  quote: MaintenanceQuote;
  onDelete: (id: string) => void;
}

export function MaintenanceQuoteCard({ quote, onDelete }: MaintenanceQuoteCardProps) {
  const parseNeeds = (needsString: string) => {
    try {
      // Remove extra quotes and escape characters
      const cleanedString = needsString.replace(/^"|"$/g, '').replace(/\\"/g, '"');
      const parsed = JSON.parse(cleanedString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing needs:', error);
      return [];
    }
  };

  const needs = parseNeeds(quote.needs);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl text-lienzo font-medium">
          {quote.fullName}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(quote.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2 border w-fit rounded-full py-1 px-2">
          {new Date(quote.createdAt).toLocaleDateString()}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <strong>Email:</strong> <span className="text-xs italic underline text-lienzo">{quote.email}</span>
          </div>
          <div>
            <strong>Phone:</strong> {quote.phoneNumber || 'N/A'}
          </div>
          <div>
            <strong>Company:</strong> {quote.companyName || 'N/A'}
          </div>
          <div>
            <strong>Size:</strong> {quote.companySize || 'N/A'}
          </div>
        </div>
        <div className="mt-4">
          <strong className="text-sm">Team Needs:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {needs.map((need: string) => (
              <Badge key={need} variant="outline">
                {need}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <strong className="text-sm">Description:</strong>
          <p className="mt-1 text-sm text-gray-600">
            {quote.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}