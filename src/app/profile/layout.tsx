"use client";

import ProtectedRoute from "@/shared/components/ProtectedRoute";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["patient"]}>{children}</ProtectedRoute>;
}
