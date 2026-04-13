"use client";

import { forwardRef } from "react";
import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#D9886A] hover:bg-[#c5765a] text-white shadow-lg",
  secondary:
    "bg-[#0D3B66] hover:bg-[#1a4f82] text-white shadow-md",
  ghost:
    "text-gray-600 hover:bg-gray-100",
  danger:
    "bg-red-50 hover:bg-red-100 text-red-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-3 px-6 text-base",
  lg: "py-3 px-12 text-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      pill = false,
      fullWidth = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "font-bold transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:pointer-events-none inline-flex items-center justify-center gap-2",
          variantStyles[variant],
          sizeStyles[size],
          pill ? "rounded-full" : "rounded-xl",
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
