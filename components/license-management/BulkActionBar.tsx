import { BulkAction, BulkActionOption } from "@/types/license-management";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReactNode, useState } from "react";
import { Roles, Role } from "@/lib/roles";
import { LICENSE_STATUS } from "@/lib/constants";
import { CheckCircle2, Download, PlayCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkActionBarProps {
  selectedCount: number;
  selectedStatuses: string[];
  onAction: (action: BulkAction) => void;
  userRole: Role;
  disabled?: boolean;
  icon?: ReactNode;
}

const getBulkActions = (selectedStatuses: string[], userRole: Role): BulkActionOption[] => {
  const isAdminOrManager = userRole === Roles.ADMIN || userRole === Roles.MANAGER;
  
  const actions: BulkActionOption[] = [
    { 
      value: 'export', 
      label: 'Export Selected',
      icon: <Download className="h-4 w-4 mr-2" />
    }
  ];

  if (isAdminOrManager) {
    if (selectedStatuses.every(status => status === LICENSE_STATUS.PAYMENT_DONE)) {
      actions.unshift({
        value: 'activate',
        label: 'Activate Licenses',
        requiresAdmin: true,
        allowedStates: [LICENSE_STATUS.PAYMENT_DONE],
        icon: <PlayCircle className="h-4 w-4 mr-2" />
      });
    }

    if (selectedStatuses.every(status => status !== 'DELETED')) {
      actions.unshift({
        value: 'delete',
        label: 'Delete Licenses',
        variant: 'destructive',
        requiresAdmin: true,
        icon: <Trash2 className="h-4 w-4 mr-2" />
      });
    }
  }

  return actions;
};

export function BulkActionBar({ 
  selectedCount, 
  selectedStatuses, 
  onAction, 
  userRole,
  disabled 
}: BulkActionBarProps) {
  const [selectedAction, setSelectedAction] = useState<BulkAction | ''>('');
  const [availableActions] = useState<BulkActionOption[]>(
    () => getBulkActions(selectedStatuses, userRole)
  );

  const handleActionSelect = (value: string) => {
    setSelectedAction(value as BulkAction);
  };

  const handleActionExecute = () => {
    if (selectedAction) {
      onAction(selectedAction);
      setSelectedAction('');
    }
  };

  const action = availableActions.find(a => a.value === selectedAction);

  return (
    <div className="flex items-center justify-between w-full gap-4 p-4 bg-background border rounded-lg">
      <span className={cn("text-sm text-muted-foreground flex items-center gap-2", selectedCount !== 0 && "text-lienzo")}>
        <CheckCircle2 className="h-4 w-4" />
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <Select
          value={selectedAction}
          onValueChange={handleActionSelect}
          disabled={disabled || selectedCount === 0}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose action" />
          </SelectTrigger>
          <SelectContent>
            {availableActions.map((action) => (
              <SelectItem
                key={action.value}
                value={action.value}
                className={`flex items-center ${action.variant === 'destructive' ? 'text-destructive' : ''}`}
              >
                <span className="flex items-center">
                  {action.icon}
                  {action.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleActionExecute}
          disabled={!selectedAction || disabled || selectedCount === 0}
          variant={action?.variant || 'default'}
          className="flex items-center gap-2"
        >
          {action?.icon}
          Apply
        </Button>
      </div>
    </div>
  );
}