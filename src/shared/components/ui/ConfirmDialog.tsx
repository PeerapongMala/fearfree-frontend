"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "./Button";

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => unknown | Promise<unknown>;
}

const initialState: ConfirmDialogState = {
  isOpen: false,
  title: "",
  message: "",
  onConfirm: () => {},
};

export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmDialogState>(initialState);

  const showConfirm = useCallback(
    (options: { title: string; message: string; onConfirm: () => unknown | Promise<unknown> }) => {
      setState({ isOpen: true, ...options });
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setState(initialState);
  }, []);

  return { dialog: state, showConfirm, closeDialog };
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => unknown | Promise<unknown>;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmLabel = "ยืนยัน",
  cancelLabel = "ยกเลิก",
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const timer = setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch {
      // onConfirm handles its own error reporting (e.g. toast)
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        tabIndex={-1}
        className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center outline-none"
      >
        <h2 id="confirm-dialog-title" className="text-[#0D3B66] font-bold text-xl mb-3">
          {title}
        </h2>
        <p className="text-gray-600 mb-8">{message}</p>
        <div className="flex justify-center gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="secondary" size="md" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
