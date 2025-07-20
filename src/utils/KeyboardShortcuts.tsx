import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => {
        const ctrlMatch = s.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = s.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = s.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === s.key.toLowerCase();
        
        return ctrlMatch && shiftMatch && altMatch && keyMatch;
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
        
        toast({
          title: "Shortcut Used",
          description: shortcut.description,
          duration: 2000,
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, toast]);
};

export const defaultShortcuts: ShortcutConfig[] = [
  {
    key: 'n',
    ctrl: true,
    description: 'Create new order',
    action: () => console.log('New order shortcut')
  },
  {
    key: 's',
    ctrl: true,
    description: 'Search',
    action: () => console.log('Search shortcut')
  },
  {
    key: 'd',
    ctrl: true,
    description: 'Go to dashboard',
    action: () => console.log('Dashboard shortcut')
  },
  {
    key: 'o',
    ctrl: true,
    description: 'Go to orders',
    action: () => console.log('Orders shortcut')
  },
  {
    key: 'i',
    ctrl: true,
    description: 'Go to inventory',
    action: () => console.log('Inventory shortcut')
  }
];