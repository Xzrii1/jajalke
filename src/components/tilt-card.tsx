"use client";

import { useRef, type ReactNode } from "react";

export function TiltCard({
  children,
  className,
  style,
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(
        2
      )}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
    });
  }

  function onLeave() {
    if (reduced || !ref.current) return;
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    el.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    setTimeout(() => {
      if (el) el.style.transition = "";
    }, 500);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)", ...style }}
      className={className}
    >
      {children}
    </div>
  );
}
