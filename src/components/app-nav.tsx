"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

export interface NavLink {
  href: string;
  label: string;
}

export function AppNav({
  brand,
  links,
  userLabel,
  roleLabel,
  guest = false,
}: {
  brand: string;
  links: NavLink[];
  userLabel: string;
  roleLabel?: string;
  guest?: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="glass-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={links[0]?.href ?? "/"} className="group flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="Logo"
            className="h-8 w-8 rounded-xl object-cover shadow-md ring-1 ring-slate-900/5 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-base font-semibold tracking-tight text-slate-900">
            {brand}
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "text-indigo-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-indigo-50 to-indigo-100/80 ring-1 ring-inset ring-indigo-600/10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-slate-900">{userLabel}</div>
            <div className="text-xs text-slate-500">
              {roleLabel ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {roleLabel}
                </span>
              ) : (
                "Perpustakaan Sekolah"
              )}
            </div>
          </div>
          {!guest && (
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.97]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Keluar
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}