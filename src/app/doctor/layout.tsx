"use client";

import ProtectedRoute from "@/shared/components/ProtectedRoute";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["doctor"]}>{children}</ProtectedRoute>;
}
