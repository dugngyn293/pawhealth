"use client";

import UserMenu from "@/components/UserMenu";
import { useTheme } from "@/components/ThemeProvider";
import { monthLabel } from "@/lib/dashboard/helpers";
import { IconMoon, IconSun } from "./Icons";

type DashboardTopBarProps = {
  month: number;
  year: number;
  years: number[];
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
};

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const CONTROL_CLASS_NAME =
  "h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-200";

export function DashboardTopBar({
  month,
  year,
  years,
  setMonth,
  setYear,
}: DashboardTopBarProps) {
  const { theme, toggle } = useTheme();
  const handleProfile = () => alert("Go to Profile page");
  const handleUpdateProfile = () => alert("Open Update Profile modal");
  const handleLogout = () => alert("Log out");

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <span className="text-sm font-semibold">P</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-slate-900 dark:text-slate-50">PawHealthAI</span>
            <span className="text-slate-400"> | </span>
            <span className="text-slate-500 dark:text-slate-400">Enterprise Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className={CONTROL_CLASS_NAME}
              aria-label="Select month"
            >
              {MONTHS.map((monthValue) => {
                return (
                  <option key={monthValue} value={monthValue}>
                    {monthLabel(monthValue)}
                  </option>
                );
              })}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={CONTROL_CLASS_NAME}
              aria-label="Select year"
            >
              {years.map((yearValue) => (
                <option key={yearValue} value={yearValue}>
                  {yearValue}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={toggle}
            className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 h-9 w-9 bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <IconMoon /> : <IconSun />}
          </button>

          <UserMenu
            initials="HR"
            name="HR Manager"
            email="hr@acme.com"
            onProfile={handleProfile}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
