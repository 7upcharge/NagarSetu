'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Signal, PlusCircle, ListFilter, UserCheck } from 'lucide-react';
import { useCivic } from '../context/CivicContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { userActivity } = useCivic();

  const activityCount = 
    userActivity.supportedIssueIds.length + 
    userActivity.reportedIssueIds.length;

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40 shadow-sm">
      {/* Top Banner */}
      <div className="bg-stone-800/80 border-b border-stone-800 px-4 py-1 text-xs text-stone-400 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Official Civic Problem Aggregation Platform
          </span>
          <span className="hidden sm:inline text-stone-400 text-[11px]">
            Civic Feedback Loop Active • Sector 4 Public Grid
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-sm transition-transform group-hover:scale-105">
            <Signal className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-stone-50">NagarSetu</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded">
                Phase 1 Signal Engine
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-normal">
              See a problem. Speak up. Get it moving.
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-stone-800 text-amber-400 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/issues"
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
              isActive('/issues')
                ? 'bg-stone-800 text-amber-400 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <ListFilter className="w-4 h-4 text-stone-400" />
            <span>Community Issues</span>
          </Link>

          <Link
            href="/activity"
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
              isActive('/activity')
                ? 'bg-stone-800 text-amber-400 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4 text-stone-400" />
            <span>My Activity</span>
            {activityCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-600 text-stone-950 text-xs font-bold rounded-full">
                {activityCount}
              </span>
            )}
          </Link>

          <Link
            href="/report"
            className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report a Problem</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
