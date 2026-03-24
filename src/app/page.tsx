"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import HeroIllustration from "@/components/HeroIllustration";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl -z-10" />

      <Navbar />

      <div className="w-full max-w-7xl mx-auto py-6 px-4 md:px-8 mt-10 md:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center md:text-left z-10 pl-0 md:pl-20 mt-12 md:mt-0">
            <h1 className="text-6xl md:text-[80px] text-[#346F81] leading-[1.15]">
              <span className="font-medium tracking-tight">เริ่มก้าวผ่าน</span>
              <br />
              <span className="font-bold tracking-tight text-[#2B6071]">ความกลัว</span>
              <br />
              <span className="font-medium tracking-tight">ไปกับเรา</span>
            </h1>

            <div className="pt-8">
              <Link
                href="/start"
                className="inline-block bg-[#D3886E] text-white text-[22px] font-bold py-4 px-16 rounded-[40px] hover:bg-[#c07a61] transition-transform hover:scale-[1.02] shadow-sm tracking-wide"
              >
                เริ่มต้น
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative flex justify-center md:justify-end">
            {/* แก้ตรงส่วนแสดงรูปภาพ */}
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
