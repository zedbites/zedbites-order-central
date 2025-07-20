import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import QuickActions from "./QuickActions";

export default function FloatingActionButton() {
  const [showActions, setShowActions] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setShowActions(!showActions)}
        size="sm"
      >
        {showActions ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>

      {showActions && (
        <>
          <div 
            className="fixed inset-0 z-30 bg-transparent"
            onClick={() => setShowActions(false)}
          />
          <QuickActions onClose={() => setShowActions(false)} />
        </>
      )}
    </>
  );
}