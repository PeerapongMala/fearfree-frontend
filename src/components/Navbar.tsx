"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth.store";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();


  const menuItems = [
    { label: "หน้าหลัก", href: "/" },
    { label: "ประเมิน", href: "/assessment" },
    { label: "แบบทดสอบ", href: "/game/categories" },
    { label: "โปรไฟล์", href: "/profile" },
  ];



  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === "/") return;

    if (!user) {
      e.preventDefault();
      // แทนที่จะ alert, เราสั่ง setNotification แทน
      toast.error("กรุณาเข้าสู่ระบบก่อนใช้งานฟังก์ชันนี้");
    }
  };

  return (
    <>
      {/* --- Navbar ปกติ --- */}
      <nav className="w-full bg-white/50 backdrop-blur-sm z-50 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-6 border-b-4 border-[#5E9AA2]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-primary-dark transition-transform group-hover:scale-110">
                <HeartHandshake size={32} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-[#2B6171]">Fear</span>
                <span className="text-[#559BA2]">Free</span>
                <span className="text-[#0D3B66]"> Animals</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const isAccessible = item.href === "/" || !!user;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "text-lg transition-all duration-200 cursor-pointer",
                      isActive
                        ? "font-bold text-[#3B667D]"
                        : isAccessible
                        ? "font-medium text-[#4D7185] hover:text-[#559BA2]"
                        : "font-medium text-gray-400 hover:text-gray-500"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
