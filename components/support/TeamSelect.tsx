'use client';

// components/support/TeamSelect.tsx
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface TeamSelectProps {
  availableMembers: TeamMember[];
  selectedMembers: TeamMember[];
  onMembersChange: (members: TeamMember[]) => void;
  className?: string;
}

export function TeamSelect({
  availableMembers,
  selectedMembers,
  onMembersChange,
  className
}: TeamSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter out already selected members
  const unselectedMembers = availableMembers.filter(
    member => !selectedMembers.some(selected => selected.id === member.id)
  );

  const handleAddMember = (member: TeamMember) => {
    onMembersChange([...selectedMembers, member]);
  };

  const handleRemoveMember = (memberId: string) => {
    onMembersChange(selectedMembers.filter(member => member.id !== memberId));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const filteredMembers = unselectedMembers.filter(member =>
    `${member.firstName} ${member.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected Team Members */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Selected Team Members</h4>
        <ScrollArea className="h-[100px] rounded-md border">
          <div className="p-4 space-y-2">
            {selectedMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No team members selected
              </p>
            ) : (
              selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between bg-secondary/20 rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {getInitials(member.firstName, member.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm">{`${member.firstName} ${member.lastName}`}</span>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Available Team Members */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Available Team Members</h4>
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4 space-y-2">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => handleAddMember(member)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {getInitials(member.firstName, member.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm">{`${member.firstName} ${member.lastName}`}</span>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                  </div>
                  <Plus className="h-4 w-4" />
                </CardContent>
              </Card>
            ))}
            {filteredMembers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No team members available
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}