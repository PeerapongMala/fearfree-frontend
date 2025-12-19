import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl -z-10" />

      <Navbar />

      <div className="w-full max-w-7xl mx-auto py-6 px-4 md:px-8 mt-10 md:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center md:text-left z-10">
            <h1 className="text-5xl md:text-7xl text-[#226177] leading-tight font-medium">
              เริ่มก้าวผ่าน
              <br />
              <span className="font-bold">ความกลัว</span>
              <br />
              ไปกับเรา
            </h1>

            <div className="pt-4">
              <Link
                href="/start"
                className="inline-block bg-[#D9886A] text-white text-xl font-bold py-3 px-20 rounded-full shadow-lg hover:bg-[#c5765a] transition-transform hover:scale-105"
              >
                เริ่มต้น
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative flex justify-center md:justify-end">
            {/* แก้ตรงส่วนแสดงรูปภาพ */}
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
              {/* เปลี่ยนจาก <img> เป็น <Image /> 
       และต้องระบุ width/height เป็นตัวเลขด้วย (Next.js บังคับ)
   */}
              <Image
                src="https://placehold.co/600x600/png?text=Woman+running+from+dog"
                alt="Illustration"
                width={600} // ต้องใส่ขนาดจริงของรูป (หรือขนาดที่ใกล้เคียง)
                height={600} // ต้องใส่ขนาดจริงของรูป
                className="object-contain w-full h-full drop-shadow-xl"
                unoptimized // สำคัญ: ใส่คำสั่งนี้เพื่อให้โหลดรูปจาก Link ภายนอกได้โดยไม่ต้องตั้งค่า Config
                priority // (Optional) ใส่เพื่อบอกว่ารูปนี้สำคัญ ให้โหลดก่อนเพื่อน (แก้เรื่อง LCP)
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
