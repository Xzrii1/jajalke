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

/* Awan = dekorasi langit track yang diam (tidak ikut berputar/geser bersama bulan) */
const CLOUDS = [
  { left: 14, top: 2, width: 16, dark: true },
  { left: 40, top: 22, width: 22, dark: true },
  { left: 4, top: 28, width: 14, dark: true },
  { left: 50, top: 4, width: 18, dark: false },
  { left: 28, top: 12, width: 20, dark: false },
  { left: 2, top: 10, width: 14, dark: false },
];

/* Titik-titik bulan di dalam knob */
const MOON_DOTS = [
  { left: 10, top: 3, size: 6 },
  { left: 2, top: 10, size: 10 },
  { left: 16, top: 18, size: 3 },
];

/* Sinar matahari, menyembul di tepi knob */
const RAYS = [
  { left: -8, top: -8, width: 43 },
  { left: -13, top: -13, width: 55 },
  { left: -18, top: -18, width: 60 },
];

/* Bintang tersebar di seluruh langit malam (tidak nempel bulan) */
const STARS = [
  { left: 6, top: 3, width: 14, delay: 0.3 },
  { left: 3, top: 16, width: 6, delay: 0 },
  { left: 16, top: 18, width: 10, delay: 0.6 },
  { left: 26, top: 5, width: 8, delay: 1.3 },
  { left: 38, top: 13, width: 12, delay: 0.9 },
  { left: 51, top: 7, width: 6, delay: 0.4 },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
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
    <label className={`theme-switch ${className}`}>
      <input
        type="checkbox"
        className="theme-switch__input"
        checked={isDark}
        onChange={toggle}
        aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
        title={isDark ? "Mode terang" : "Mode gelap"}
      />
      <span className="theme-switch__slider">
        {/* Knob matahari/bulan: tenggelam di langit track (dots + sinar) */}
        <span className="theme-switch__knob">
          {MOON_DOTS.map((d, i) => (
            <svg
              key={i}
              className="theme-switch__moon-dot"
              style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle cx="50" cy="50" r="50" />
            </svg>
          ))}
          {RAYS.map((r, i) => (
            <svg
              key={i}
              className="theme-switch__ray"
              style={{ left: r.left, top: r.top, width: r.width, height: r.width }}
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle cx="50" cy="50" r="50" />
            </svg>
          ))}
        </span>

        {/* Awan langit: diam, hanya bergoyang pelan */}
        <span className="theme-switch__clouds">
          {CLOUDS.map((c, i) => (
            <svg
              key={i}
              className={`theme-switch__cloud ${c.dark ? "theme-switch__cloud--dark" : ""}`}
              style={{ left: c.left, top: c.top, width: c.width, height: c.width }}
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle cx="50" cy="50" r="50" />
            </svg>
          ))}
        </span>

        {/* Bintang langit malam: muncul saat gelap, tersebar di seluruh track */}
        <span className="theme-switch__stars">
          {STARS.map((s, i) => (
            <svg
              key={i}
              className="theme-switch__star"
              style={{ left: s.left, top: s.top, width: s.width, animationDelay: `${s.delay}s` }}
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
            </svg>
          ))}
        </span>
      </span>
    </label>
  );
}