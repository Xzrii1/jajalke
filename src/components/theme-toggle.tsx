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

const CLOUDS = [
  { left: 30, top: 15, width: 40, dark: true },
  { left: 44, top: 10, width: 20, dark: true },
  { left: 18, top: 24, width: 30, dark: true },
  { left: 36, top: 18, width: 40, dark: false },
  { left: 48, top: 14, width: 20, dark: false },
  { left: 22, top: 26, width: 30, dark: false },
];

const MOON_DOTS = [
  { left: 10, top: 3, size: 6 },
  { left: 2, top: 10, size: 10 },
  { left: 16, top: 18, size: 3 },
];

const RAYS = [
  { left: -8, top: -8, width: 43 },
  { left: -13, top: -13, width: 55 },
  { left: -18, top: -18, width: 60 },
];

const STARS = [
  { left: 3, top: 2, width: 20, delay: 0.3 },
  { left: 3, top: 16, width: 6, delay: 0 },
  { left: 10, top: 20, width: 12, delay: 0.6 },
  { left: 18, top: 0, width: 18, delay: 1.3 },
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
        {/* Knob matahari/bulan berisi titik bulan, sinar, dan awan */}
        <span className="theme-switch__knob">
          <span className="theme-switch__knob-inner">
            {/* Titik-titik bulan */}
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

            {/* Sinar matahari (menyembul di sekeliling knob) */}
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

            {/* Awan mengambang (ikut berputar bersama matahari/bulan) */}
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
        </span>

        {/* Bintang: saudara kandung dari knob, di atas track */}
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