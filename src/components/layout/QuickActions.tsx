import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ShoppingCart, Package, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color?: string;
}

interface QuickActionsProps {
  onClose: () => void;
}

export default function QuickActions({ onClose }: QuickActionsProps) {
  const quickActions: QuickAction[] = [
    {
      id: "new-order",
      label: "New Order",
      icon: ShoppingCart,
      onClick: () => {
        // Navigate to new order
        onClose();
      },
      color: "bg-primary text-primary-foreground"
    },
    {
      id: "add-item",
      label: "Add Menu Item",
      icon: Plus,
      onClick: () => {
        // Navigate to add menu item
        onClose();
      },
      color: "bg-success text-success-foreground"
    },
    {
      id: "inventory",
      label: "Quick Stock Update",
      icon: Package,
      onClick: () => {
        // Navigate to inventory
        onClose();
      },
      color: "bg-warning text-warning-foreground"
    },
    {
      id: "user",
      label: "Add User",
      icon: Users,
      onClick: () => {
        // Navigate to user management
        onClose();
      },
      color: "bg-info text-info-foreground"
    }
  ];

  return (
    <Card className="absolute bottom-20 right-4 z-50 w-64 shadow-lg">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                onClick={action.onClick}
                className={cn(
                  "h-16 flex flex-col gap-1 text-xs",
                  action.color && action.color
                )}
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}