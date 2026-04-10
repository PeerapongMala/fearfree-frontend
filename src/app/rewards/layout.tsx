"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["patient"]}>{children}</ProtectedRoute>;
}
