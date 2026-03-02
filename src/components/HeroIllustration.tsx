import Image from "next/image";

export default function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center mix-blend-multiply">
      <Image
        src="/hero_illustration_new.png"
        alt="FearFree Hero Illustration"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
