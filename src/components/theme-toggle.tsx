"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const THEME_STORAGE_KEY = "theme";
export const THEME_EVENT = "jajal-theme";

function getInitial(): "dark" | "light" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setThemePref(mode: "dark" | "light") {
  const root = document.documentElement;
  const prev = root.classList.contains("dark");
  const next = mode === "dark";
  root.classList.toggle("dark", next);
  root.style.colorScheme = next ? "dark" : "light";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
  } catch {
    /* storage tidak tersedia */
  }
  root.classList.add("theme-transition");
  window.setTimeout(() => root.classList.remove("theme-transition"), 900);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { mode } }));
  if (prev !== next) {
    console.debug("[theme]", next ? "gelap" : "terang");
  }
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  );
}

export function ThemeToggle({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const [mode, setMode] = useState<"dark" | "light">(getInitial);

  useEffect(() => {
    const sync = (e: Event) => {
      const detail = (e as CustomEvent<{ mode: "dark" | "light" }>).detail;
      if (detail?.mode) setMode(detail.mode);
      else setMode(getInitial());
    };
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const isDark = mode === "dark";
  const toggle = () => setThemePref(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={`relative h-8 w-[60px] shrink-0 rounded-full border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
        isDark
          ? "border-white/15 bg-gradient-to-r from-slate-800 to-indigo-950"
          : "border-slate-200 bg-gradient-to-r from-amber-100 to-orange-200/70"
      } ${variant === "light" && !isDark ? "border-slate-300" : ""} ${className}`}
    >
      <SunIcon
        className={`pointer-events-none absolute left-[7px] top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
          isDark ? "text-amber-300" : "text-amber-500"
        }`}
      />
      <MoonIcon
        className={`pointer-events-none absolute right-[7px] top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
          isDark ? "text-indigo-200" : "text-slate-400"
        }`}
      />

      {/* Thumb geser */}
      <span className="absolute inset-y-[4px] left-[4px] w-6">
        <motion.span
          animate={{ x: isDark ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 550, damping: 34 }}
          className={`flex h-full w-full items-center justify-center rounded-full shadow-md ${
            isDark
              ? "bg-slate-900 ring-1 ring-white/25"
              : "bg-white ring-1 ring-slate-200/60"
          }`}
        >
          {isDark ? (
            <MoonIcon className="h-3.5 w-3.5 text-indigo-200" />
          ) : (
            <SunIcon className="h-3.5 w-3.5 text-amber-500" />
          )}
        </motion.span>
      </span>
    </button>
  );
}