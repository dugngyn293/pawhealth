"use client";

import type { ReactNode } from "react";

type IconProps = {
  children: ReactNode;
  className: string;
};

function IconBase({ children, className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      {children}
    </svg>
  );
}

export function IconUsers() {
  return (
    <IconBase className="text-slate-600 dark:text-slate-200">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  );
}

export function IconTrend() {
  return (
    <IconBase className="text-slate-600 dark:text-slate-200">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </IconBase>
  );
}

export function IconBars() {
  return (
    <IconBase className="text-slate-600 dark:text-slate-200">
      <path d="M3 3v18h18" />
      <path d="M7 15v-6" />
      <path d="M11 15V5" />
      <path d="M15 15v-9" />
      <path d="M19 15v-3" />
    </IconBase>
  );
}

export function IconAlert() {
  return (
    <IconBase className="text-slate-600 dark:text-slate-200">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </IconBase>
  );
}

export function IconLayers() {
  return (
    <IconBase className="text-indigo-600 dark:text-indigo-300">
      <path d="M12 20l9-5-9-5-9 5 9 5z" />
      <path d="M12 12l9-5-9-5-9 5 9 5z" />
    </IconBase>
  );
}

export function IconSun() {
  return (
    <IconBase className="text-amber-500">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </IconBase>
  );
}

export function IconMoon() {
  return (
    <IconBase className="text-slate-700 dark:text-slate-200">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </IconBase>
  );
}
