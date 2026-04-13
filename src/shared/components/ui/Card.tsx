"use client";

import { forwardRef } from "react";
import { cn } from "@/shared/lib/cn";

type CardVariant = "solid" | "glass";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  solid:
    "bg-white shadow-sm border border-gray-100",
  glass:
    "bg-white/90 backdrop-blur-xl shadow-2xl border border-white/60",
};

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "solid", padding = "lg", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl",
          variantStyles[variant],
          paddingStyles[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card };
export type { CardProps };
