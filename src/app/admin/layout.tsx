"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Gift, Gamepad2, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "ภาพรวม", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/rewards", label: "จัดการของรางวัล", icon: <Gift size={20} /> },
    { path: "/admin/games", label: "จัดการเกม", icon: <Gamepad2 size={20} /> },
  ];

  if (!user || user.role !== "admin") {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#E6F4F1] to-[#CDE8E5] font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <span className="text-[#0D3B66] text-3xl font-bold">Ψ</span>
            <h1 className="text-[#0D3B66] font-bold text-xl leading-tight">FearFree<br/>Admin</h1>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive
                      ? "bg-[#0D3B66] text-white shadow-md shadow-[#0D3B66]/20"
                      : "text-gray-500 hover:bg-gray-100 hover:text-[#0D3B66]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content (with Mobile Header) */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Mobile Header (Shows only on small screens) */}
        <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="text-[#0D3B66] font-bold text-xl flex items-center gap-2">
            <span>Ψ</span> Admin
          </div>
          <button onClick={handleLogout} className="text-red-500">
            <LogOut size={24} />
          </button>
        </header>

        <main className="p-6 lg:p-10 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
