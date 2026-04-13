"use client";

import { forwardRef, useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type InputVariant = "default" | "filled";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: boolean;
  variant?: InputVariant;
  /** Renders a password toggle button when true */
  isPassword?: boolean;
}

const variantStyles: Record<InputVariant, string> = {
  default:
    "bg-white border-gray-300 focus:ring-primary/50",
  filled:
    "bg-gray-50 border-gray-200 focus:ring-[#0D3B66]/30",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = "default", isPassword, className, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const autoId = useId();
    const inputId = id ?? autoId;

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-700 transition-all",
              variantStyles[variant],
              error && "border-red-500 focus:ring-red-200",
              isPassword && "pr-12",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0D3B66]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
