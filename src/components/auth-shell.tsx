import type { ReactNode } from "react";
import Link from "next/link";
import { SchoolBackdrop } from "./school-backdrop";
import { TiltCard } from "./tilt-card";

export function AuthShell({
  title,
  subtitle,
  badge,
  children,
  footerHref,
  footerLabel,
}: {
  title: string;
  subtitle: ReactNode;
  badge?: string;
  children: ReactNode;
  footerHref: string;
  footerLabel: ReactNode;
}) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
      <SchoolBackdrop />

      {/* Dekorasi glow lembut di belakang kartu */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5]">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
      </div>

      <div className="anim-rise relative w-full max-w-md">
        <div className="mb-7 text-center">
          <span
            style={{ animationDelay: "70ms" }}
            className="anim-rise relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/90 p-1.5 shadow-xl ring-1 ring-white/70 backdrop-blur"
          >
            <span
              aria-hidden
              className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/50 via-violet-500/40 to-fuchsia-500/40 blur-md"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="Logo perpustakaan"
              className="h-full w-full rounded-2xl object-cover"
            />
          </span>
          {badge && (
            <span className="anim-rise mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-100 backdrop-blur">
              {badge}
            </span>
          )}
          <h1
            style={{ animationDelay: "140ms" }}
            className="anim-rise mt-3 text-balance font-display text-3xl font-medium tracking-tight text-white sm:text-4xl"
          >
            {title}
          </h1>
          <p
            style={{ animationDelay: "210ms" }}
            className="anim-rise mx-auto mt-2 max-w-sm text-sm leading-relaxed text-indigo-100/80"
          >
            {subtitle}
          </p>
        </div>

        <TiltCard className="will-change-transform">
          <div
            style={{ animationDelay: "280ms" }}
            className="anim-rise glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
            />
            {children}
          </div>
        </TiltCard>

        <p
          style={{ animationDelay: "350ms" }}
          className="anim-rise mt-6 text-center text-sm text-indigo-100/75"
        >
          <Link
            href={footerHref}
            className="font-semibold text-white underline decoration-indigo-300/60 underline-offset-4 transition hover:decoration-white"
          >
            {footerLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
