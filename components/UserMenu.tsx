"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UserMenuProps = {
  initials?: string;
  name?: string;
  email?: string;
  onProfile?: () => void;
  onUpdateProfile?: () => void;
  onLogout?: () => void;
};

const TRIGGER_CLASS =
  "flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700";
const PANEL_CLASS =
  "absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden";

export default function UserMenu({
  initials = "HR",
  name = "HR Manager",
  email = "hr@company.com",
  onProfile,
  onUpdateProfile,
  onLogout,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const runAction = useCallback(
    (action?: () => void) => {
      closeMenu();
      action?.();
    },
    [closeMenu],
  );

  useEffect(() => {
    function handleDocumentMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) closeMenu();
    }

    function handleDocumentKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [closeMenu]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={TRIGGER_CLASS}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open ? (
        <div role="menu" className={PANEL_CLASS}>
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{email}</div>
          </div>

          <div className="py-2">
            <MenuItem label="Profile" onClick={() => runAction(onProfile)} />
            <MenuItem label="Update profile" onClick={() => runAction(onUpdateProfile)} />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 py-2">
            <MenuItem label="Log out" danger onClick={() => runAction(onLogout)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

type MenuItemProps = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

function MenuItem({ label, onClick, danger }: MenuItemProps) {
  const itemClass = danger
    ? "text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800";

  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`w-full px-4 py-2 text-left text-sm ${itemClass}`}
    >
      {label}
    </button>
  );
}
