import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  onClick?: () => void;
  loading?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  onClick,
  loading = false 
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "shadow-card transition-all duration-200 hover:shadow-lg",
        onClick && "cursor-pointer hover:scale-105"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          ) : (
            value
          )}
        </div>
        {change && changeType && (
          <div className="flex items-center text-xs mt-1">
            {changeType === 'positive' ? (
              <TrendingUp className="mr-1 h-3 w-3 text-success" />
            ) : changeType === 'negative' ? (
              <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
            ) : null}
            <Badge 
              variant="outline" 
              className={cn(
                changeType === 'positive' && 'text-success border-success',
                changeType === 'negative' && 'text-destructive border-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}