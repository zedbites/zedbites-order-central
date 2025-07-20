import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onHome: () => void;
}

export default function Breadcrumbs({ items, onHome }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onHome}
        className="h-6 px-2 hover:bg-muted"
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className="h-6 px-2 hover:bg-muted"
            >
              {item.label}
            </Button>
          ) : (
            <span className="px-2 py-1 font-medium text-foreground">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}