"use client";

import { useState, useEffect } from "react"; // เพิ่ม useEffect
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HeartHandshake, AlertCircle, X } from "lucide-react"; // เพิ่ม Icon
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/stores/auth.store";
import { motion, AnimatePresence } from "framer-motion"; // เพิ่ม Motion

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  // State สำหรับเก็บข้อความแจ้งเตือน (ถ้ามีค่า = แสดง, ถ้า null = ซ่อน)
  const [notification, setNotification] = useState<string | null>(null);

  const menuItems = [
    { label: "หน้าหลัก", href: "/" },
    { label: "ประเมิน", href: "/assessment" },
    { label: "แบบทดสอบ", href: "/game/categories" },
    { label: "โปรไฟล์", href: "/profile" },
  ];

  // Logic การปิด Notification อัตโนมัติ
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
        // ถ้าอยากให้เด้งไปหน้า Login หลังจากแจ้งเตือนหาย ให้เปิดบรรทัดล่างนี้ครับ
        // router.push("/login-select");
      }, 3000); // แสดง 3 วินาที
      return () => clearTimeout(timer);
    }
  }, [notification, router]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === "/") return;

    if (!user) {
      e.preventDefault();
      // แทนที่จะ alert, เราสั่ง setNotification แทน
      setNotification("กรุณาเข้าสู่ระบบก่อนใช้งานฟังก์ชันนี้");
    }
  };

  return (
    <>
      {/* --- ส่วน Notification Popup (Slide Down) --- */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-6 left-0 right-0 z-100 flex justify-center pointer-events-none"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto border-2 border-white/20 backdrop-blur-md">
              <AlertCircle size={24} className="text-white" />
              <span className="font-bold text-lg">{notification}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Navbar ปกติ --- */}
      <nav className="w-full bg-white/50 backdrop-blur-sm z-50 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-6 border-b-4 border-primary-dark">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-primary-dark transition-transform group-hover:scale-110">
                <HeartHandshake size={32} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-[#0D3B66]">Fear</span>
                <span className="text-primary-dark">Free</span>
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
                        ? "font-bold text-[#0D3B66] scale-105"
                        : isAccessible
                        ? "font-medium text-[#0D3B66b0] hover:text-accent"
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
