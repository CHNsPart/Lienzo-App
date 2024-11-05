// components/quote-requests/QuoteRequestCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { QuoteRequest } from "@/types/quoteRequest";

interface QuoteRequestCardProps {
  quoteRequest: QuoteRequest;
  onDelete: (id: string) => void;
}

export function QuoteRequestCard({ quoteRequest, onDelete }: QuoteRequestCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl text-lienzo font-medium">
          {quoteRequest.fullName}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(quoteRequest.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2 border w-fit rounded-full py-1 px-2">
          {new Date(quoteRequest.createdAt).toLocaleDateString()}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <strong>Email:</strong> {quoteRequest.email}
          </div>
          <div>
            <strong>Phone:</strong> {quoteRequest.phoneNumber || 'N/A'}
          </div>
          <div>
            <strong>Company:</strong> {quoteRequest.companyName || 'N/A'}
          </div>
          <div>
            <strong>Size:</strong> {quoteRequest.companySize || 'N/A'}
          </div>
        </div>
        <div className="mt-2 text-sm">
          <strong>Interests:</strong> {quoteRequest.interests || 'N/A'}
        </div>
      </CardContent>
    </Card>
  );
}