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
  { left: 34, top: 19, width: 40, dark: false },
  { left: 48, top: 14, width: 20, dark: true },
  { left: 22, top: 28, width: 30, dark: false },
  { left: 40, top: 22, width: 40, dark: true },
  { left: 52, top: 18, width: 20, dark: true },
  { left: 26, top: 30, width: 30, dark: false },
];

const STARS = [
  { left: 3, top: 2, width: 18, delay: 0.3 },
  { left: 4, top: 16, width: 5, delay: 0 },
  { left: 10, top: 21, width: 11, delay: 0.6 },
  { left: 17, top: 1, width: 16, delay: 1.3 },
];

const MOON_DOTS = [
  { left: 10, top: 3, size: 6 },
  { left: 2, top: 10, size: 10 },
  { left: 16, top: 18, size: 3 },
];

const RAYS = [
  { left: -9, top: -9, width: 44, ratio: 1 },
  { left: -13, top: -13, width: 55, ratio: 1 },
  { left: -18, top: -18, width: 62, ratio: 1 },
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
        {/* Awan mengambang di langit track */}
        {CLOUDS.map((c, i) => (
          <svg
            key={i}
            className={`theme-switch__cloud ${c.dark ? "theme-switch__cloud--dark" : ""}`}
            style={{ left: c.left, top: c.top, width: c.width }}
            viewBox="0 0 40 26"
            aria-hidden
          >
            <path d="M7 17a4.5 4.5 0 0 1-.3-8.9A6 6 0 0 1 17.5 5.4a5.2 5.2 0 0 1 2.6 9A4.2 4.2 0 0 1 18.5 17z" />
          </svg>
        ))}

        {/* Knob matahari/bulan */}
        <span className="theme-switch__knob">
          <span className="theme-switch__knob-inner">
            {/* Titik-titik bulan */}
            {MOON_DOTS.map((d, i) => (
              <svg
                key={i}
                className="theme-switch__moon-dot"
                style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
                viewBox="0 0 10 10"
                aria-hidden
              >
                <circle cx="5" cy="5" r="5" />
              </svg>
            ))}

            {/* Bintang */}
            <span className="theme-switch__stars">
              {STARS.map((s, i) => (
                <svg
                  key={i}
                  className="theme-switch__star"
                  style={{ left: s.left, top: s.top, width: s.width, animationDelay: `${s.delay}s` }}
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
                </svg>
              ))}
            </span>
          </span>

          {/* Sinar matahari (menyembul di sekeliling knob) */}
          {RAYS.map((r, i) => (
            <svg
              key={i}
              className="theme-switch__ray"
              style={{ left: r.left, top: r.top, width: r.width, height: r.width }}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle cx="12" cy="12" r="12" />
            </svg>
          ))}
        </span>
      </span>
    </label>
  );
}