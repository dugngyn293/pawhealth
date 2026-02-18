"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  initials?: string; // e.g. "HR"
  name?: string;     // e.g. "HR Manager"
  email?: string;    // e.g. "hr@acme.com"
  onProfile?: () => void;
  onUpdateProfile?: () => void;
  onLogout?: () => void;
};

export default function UserMenu({
  initials = "HR",
  name = "HR Manager",
  email = "hr@company.com",
  onProfile,
  onUpdateProfile,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click / ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full
                   bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200
                   text-sm font-semibold border border-transparent hover:border-slate-200 dark:hover:border-slate-700
                   focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-700
                     bg-white dark:bg-slate-900 shadow-lg overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{email}</div>
          </div>

          <div className="py-2">
            <MenuItem
              label="Profile"
              onClick={() => {
                setOpen(false);
                onProfile?.();
              }}
            />
            <MenuItem
              label="Update profile"
              onClick={() => {
                setOpen(false);
                onUpdateProfile?.();
              }}
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 py-2">
            <MenuItem
              label="Log out"
              danger
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`w-full px-4 py-2 text-left text-sm
        ${danger
          ? "text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"}
      `}
    >
      {label}
    </button>
  );
}
