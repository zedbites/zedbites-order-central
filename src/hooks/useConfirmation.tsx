import { useState } from "react";

interface ConfirmationState {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  destructive: boolean;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    open: false,
    title: "",
    description: "",
    confirmLabel: "Confirm",
    onConfirm: () => {},
    destructive: false
  });

  const confirm = (options: {
    title: string;
    description: string;
    confirmLabel?: string;
    onConfirm: () => void;
    destructive?: boolean;
  }) => {
    setState({
      open: true,
      title: options.title,
      description: options.description,
      confirmLabel: options.confirmLabel || "Confirm",
      onConfirm: options.onConfirm,
      destructive: options.destructive || false
    });
  };

  const close = () => {
    setState(prev => ({ ...prev, open: false }));
  };

  return {
    ...state,
    confirm,
    close
  };
}