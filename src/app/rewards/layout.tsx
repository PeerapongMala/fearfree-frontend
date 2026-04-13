"use client";

import ProtectedRoute from "@/shared/components/ProtectedRoute";

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["patient"]}>{children}</ProtectedRoute>;
}
