'use client';

// components/support/DocumentSelect.tsx
import { useEffect, useState } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { InstructionDocument } from '@/types/support';

interface DocumentSelectProps {
  availableDocuments: InstructionDocument[];
  selectedDocuments: InstructionDocument[];
  onDocumentsChange: (documents: InstructionDocument[]) => void;
  className?: string;
}

export function DocumentSelect({
  availableDocuments,
  selectedDocuments,
  onDocumentsChange,
  className
}: DocumentSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter out already selected documents
  const unselectedDocuments = availableDocuments.filter(
    doc => !selectedDocuments.some(selected => selected.id === doc.id)
  );

  const handleAddDocument = (document: InstructionDocument) => {
    onDocumentsChange([...selectedDocuments, document]);
  };

  const handleRemoveDocument = (documentId: string) => {
    onDocumentsChange(selectedDocuments.filter(doc => doc.id !== documentId));
  };

  const filteredDocuments = unselectedDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected Documents */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Selected Documents</h4>
        <ScrollArea className="h-[100px] rounded-md border">
          <div className="p-4 space-y-2">
            {selectedDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No documents selected
              </p>
            ) : (
              selectedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-secondary/20 rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doc.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveDocument(doc.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Available Documents */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Available Documents</h4>
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4 space-y-2">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => handleAddDocument(doc)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doc.title}</span>
                  </div>
                  <Plus className="h-4 w-4" />
                </CardContent>
              </Card>
            ))}
            {filteredDocuments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No documents available
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}