import type { Metadata } from "next";
import { Prompt } from "next/font/google"; // 1. import font
import "./globals.css";
import { Toaster } from "react-hot-toast";

// 2. ตั้งค่า font
const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "FearFree Animals",
  description: "Web application for phobia treatment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      {/* 3. ใส่ className ของ font ลงไป */}
      <body className={`${prompt.variable} font-sans antialiased`}>
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              padding: '16px',
              borderRadius: '10px',
              fontSize: '16px',
            }
          }} 
        />
        {children}
      </body>
    </html>
  );
}
