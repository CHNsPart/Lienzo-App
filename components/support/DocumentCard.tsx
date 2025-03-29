// components/support/DocumentCard.tsx
'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentCardProps {
  title: string;
  fileNames?: string[];
}

export function DocumentCard({ title, fileNames = [] }: DocumentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const multipleFiles = fileNames.length > 1;

  const handleDownload = async (fileName: string) => {
    try {
      const response = await fetch(`/uploads/${fileName}`);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadAllFiles = async () => {
    for (const fileName of fileNames) {
      await handleDownload(fileName);
    }
    
    toast({
      title: "Success",
      description: `Started downloading ${fileNames.length} files`,
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{title}</span>
          {multipleFiles && (
            <Badge variant="outline" className="ml-2">
              {fileNames.length} files
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {multipleFiles ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAllFiles}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Download All</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download all files</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded(!expanded)}
                className="h-8 w-8"
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileNames.length > 0 ? handleDownload(fileNames[0]) : null}
              className="flex items-center gap-2"
              disabled={fileNames.length === 0}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>

      {expanded && multipleFiles && (
        <div className="mt-3 pt-3 border-t space-y-2">
          {fileNames.map((fileName, index) => (
            <div key={index} className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">{fileName}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(fileName)}
                className="h-7 w-7"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}