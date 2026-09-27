"use client";

import { useEffect, useState } from "react";

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

  const toggle = () => setThemePref(mode === "dark" ? "light" : "dark");

  const isDark = mode === "dark";
  const base =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-indigo-500/40";
  const style =
    variant === "dark"
      ? "border border-white/15 bg-white/5 text-indigo-100 hover:bg-white/10 hover:text-white"
      : "border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-800";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`${base} ${style} ${className}`}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
    >
      {/* Ikon matahari: terlihat saat mode gelap (dst) */}
      <svg
        className={`h-5 w-5 transition-transform duration-500 ${
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        />
      </svg>
      {/* Ikon bulan: terlihat saat mode terang */}
      <svg
        className={`-ml-5 h-5 w-5 transition-transform duration-500 ${
          isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
        />
      </svg>
    </button>
  );
}