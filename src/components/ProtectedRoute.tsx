"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { UserRole } from "@/models/user.model";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      router.replace("/login-select");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/login-select");
    }
  }, [mounted, user, allowedRoles, router]);

  // Prevent flash of protected content during SSR hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-teal-50 to-teal-100">
        <Loader2 className="animate-spin text-[#0D3B66]" size={48} />
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
