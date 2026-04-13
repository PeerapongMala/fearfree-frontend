"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/shared/lib/cn";

type TextareaVariant = "default" | "filled";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  variant?: TextareaVariant;
}

const variantStyles: Record<TextareaVariant, string> = {
  default:
    "bg-white border-gray-300 focus:ring-primary/50",
  filled:
    "bg-gray-50 border-gray-200 focus:ring-[#0D3B66]/30",
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, variant = "default", className, id, ...props }, ref) => {
    const autoId = useId();
    const textareaId = id ?? autoId;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-700 transition-all resize-none h-24",
            variantStyles[variant],
            error && "border-red-500 focus:ring-red-200",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
