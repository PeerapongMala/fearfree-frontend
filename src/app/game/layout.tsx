"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["patient"]}>{children}</ProtectedRoute>;
}
