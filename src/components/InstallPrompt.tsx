import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed this before
      const hasSeenInstallPrompt = localStorage.getItem("hasSeenInstallPrompt");
      if (!hasSeenInstallPrompt) {
        setShowDialog(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowDialog(false);
    localStorage.setItem("hasSeenInstallPrompt", "true");
  };

  const handleDismiss = () => {
    setShowDialog(false);
    localStorage.setItem("hasSeenInstallPrompt", "true");
  };

  if (!showDialog || !deferredPrompt) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Install ZedBites
          </DialogTitle>
          <DialogDescription>
            Add ZedBites to your home screen for quick access and a better experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Benefits of installing:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Quick access from your home screen</li>
              <li>Works offline for basic features</li>
              <li>Faster loading times</li>
              <li>Full-screen experience</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleDismiss} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Not now
          </Button>
          <Button onClick={handleInstall} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Install
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};