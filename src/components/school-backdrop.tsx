import Image from "next/image";

export function SchoolBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <Image
        src="/school-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover blur-[2px] saturate-[0.85]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/85 via-blue-900/65 to-indigo-950/75" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,rgba(2,6,23,0.55)_100%)]" />
    </div>
  );
}