import { Suspense } from "react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminShell } from "@/components/admin-shell";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="text-white">Loading dashboard...</div>}>
        <AdminDashboard />
      </Suspense>
    </AdminShell>
  );
}
