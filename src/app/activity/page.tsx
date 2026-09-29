'use client';

import React from 'react';
import Link from 'next/link';
import { useCivic } from '../../context/CivicContext';
import { IssueCard } from '../../components/IssueCard';
import { UserCheck, PlusCircle, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function ActivityPage() {
  const { issues, userActivity } = useCivic();

  const supportedIssues = issues.filter((i) => userActivity.supportedIssueIds.includes(i.id));
  const reportedIssues = issues.filter((i) => userActivity.reportedIssueIds.includes(i.id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Citizen Activity Ledger
        </span>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          My Activity
        </h1>
        <p className="text-sm text-stone-600">
          Track the civic complaints you have filed, joined, or helped escalate to local administration.
        </p>
      </div>

      {/* Activity Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
          <span className="block text-xs font-mono uppercase text-stone-500 mb-1">
            Problems I Reported
          </span>
          <span className="text-2xl font-bold font-mono text-stone-900">
            {userActivity.reportedIssueIds.length}
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
          <span className="block text-xs font-mono uppercase text-stone-500 mb-1">
            Problems I Supported
          </span>
          <span className="text-2xl font-bold font-mono text-stone-900">
            {userActivity.supportedIssueIds.length}
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
          <span className="block text-xs font-mono uppercase text-stone-500 mb-1">
            Total Signal Impact
          </span>
          <span className="text-2xl font-bold font-mono text-amber-600">
            {userActivity.supportedIssueIds.length + userActivity.reportedIssueIds.length} Signals
          </span>
        </div>
      </div>

      {/* Section 1: Supported Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-amber-600" />
          <span>Problems I Supported</span>
        </h2>

        {supportedIssues.length > 0 ? (
          <div className="space-y-3">
            {supportedIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      Supported
                    </span>
                    <span className="text-xs text-stone-500 font-mono">{issue.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{issue.title}</h3>
                  <p className="text-xs text-stone-600 font-medium">
                    You supported this report. <span className="font-bold text-stone-900">{issue.communityReports} people</span> are now part of this signal ({issue.peopleAffected} affected).
                  </p>
                </div>

                <Link
                  href={`/issues/${issue.id}`}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 font-semibold text-xs rounded-lg flex items-center gap-1.5 self-start sm:self-center shrink-0"
                >
                  <span>View status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-3">
            <p className="text-sm font-medium text-stone-700">You haven't supported any active issues yet.</p>
            <p className="text-xs text-stone-500">
              Browse community issues and click "I'm affected too" to turn isolated complaints into collective signals.
            </p>
            <Link
              href="/issues"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-stone-950 font-bold text-xs rounded-lg"
            >
              Explore Community Issues
            </Link>
          </div>
        )}
      </div>

      {/* Section 2: Reported Issues */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-stone-700" />
          <span>Problems I Reported</span>
        </h2>

        {reportedIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportedIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-3">
            <p className="text-sm font-medium text-stone-700">You haven't submitted any new reports yet.</p>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-amber-400 font-semibold text-xs rounded-lg"
            >
              Report a Problem
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
