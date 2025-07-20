import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";
import { defaultShortcuts } from "@/utils/KeyboardShortcuts";

export const ShortcutsDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenShortcuts = localStorage.getItem("hasSeenShortcuts");
    if (!hasSeenShortcuts) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("hasSeenShortcuts", "true");
  };

  const formatShortcut = (shortcut: any) => {
    const keys = [];
    if (shortcut.ctrl) keys.push("Ctrl");
    if (shortcut.shift) keys.push("Shift");
    if (shortcut.alt) keys.push("Alt");
    keys.push(shortcut.key.toUpperCase());
    return keys.join(" + ");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate faster through the app
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {defaultShortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm">{shortcut.description}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {formatShortcut(shortcut)}
              </Badge>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleClose}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};