"use client";

import ProtectedRoute from "@/shared/components/ProtectedRoute";

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["patient"]}>{children}</ProtectedRoute>;
}
