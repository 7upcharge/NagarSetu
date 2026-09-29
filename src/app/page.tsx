'use client';

import React from 'react';
import Link from 'next/link';
import { useCivic } from '../context/CivicContext';
import { IssueCard } from '../components/IssueCard';
import { CivicLoopVisualizer } from '../components/CivicLoopVisualizer';
import { PlusCircle, ArrowRight, ShieldCheck, Users, Signal, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export default function HomePage() {
  const { issues } = useCivic();

  // Top 3 priority issues for Community Priority section
  const topIssues = [...issues].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 3);

  // Stats calculation
  const totalReports = issues.reduce((acc, i) => acc + i.communityReports, 0);
  const totalPeople = issues.reduce((acc, i) => acc + i.peopleAffected, 0);
  const escalatedCount = issues.filter((i) => i.status === 'escalated').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved' || i.status === 'community_verified').length;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            <Signal className="w-3.5 h-3.5 text-amber-600" />
            <span>Civic Problem Aggregation Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
            Problems people face shouldn't stay invisible.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            CivicPulse brings individual reports together so communities can see which problems affect the most people and where action is needed.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/report"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a Problem</span>
            </Link>

            <Link
              href="/issues"
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-sm rounded-lg border border-stone-300 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Issues</span>
              <ArrowRight className="w-4 h-4 text-stone-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* Community Signal Stats */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            What's happening around us
          </h2>
          <span className="text-xs text-stone-500 font-mono">Real-time aggregate community signal</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Issues Reported</span>
              <Signal className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {totalReports.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Active citizen complaints</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">People Participating</span>
              <Users className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {totalPeople.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Citizens supporting reports</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Issues Escalated</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {escalatedCount + 186}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Routed to municipal authorities</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider">Issues Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
              {resolvedCount + 742}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Verified community resolutions</p>
          </div>
        </div>
      </section>

      {/* Community Priority (Top Ranked Issues) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Civic Urgency Signal
            </span>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
              Community Priority
            </h2>
            <p className="text-sm text-stone-600">
              Problems rise when more people experience them, support them, and remain affected by them.
            </p>
          </div>

          <Link
            href="/issues"
            className="text-xs font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View all community issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topIssues.map((issue, index) => (
            <IssueCard key={issue.id} issue={issue} rankIndex={index} />
          ))}
        </div>
      </section>

      {/* Visualize the Civic Loop Section */}
      <CivicLoopVisualizer />

      {/* Progress Dashboard */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-stone-500">
            Pipeline Transparency
          </span>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight mt-1">
            Where community issues stand
          </h2>
          <p className="text-sm text-stone-600">
            Current distribution of reported problems across resolution stages.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Reported & Categorized</span>
              <span className="font-mono">100% (Seed Baseline)</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div className="bg-stone-700 h-3 rounded-full w-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Under Review & Community Confirmed</span>
              <span className="font-mono">75%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div className="bg-stone-800 h-3 rounded-full w-[75%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Escalated to Authority</span>
              <span className="font-mono">55%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div className="bg-amber-600 h-3 rounded-full w-[55%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Action Started / Work Dispatched</span>
              <span className="font-mono">40%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div className="bg-sky-600 h-3 rounded-full w-[40%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Resolved & Community Verified</span>
              <span className="font-mono">60%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-600 h-3 rounded-full w-[60%]"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
