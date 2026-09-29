'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CivicIssue } from '../types';
import { useCivic } from '../context/CivicContext';
import { Users, MapPin, AlertCircle, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';

interface IssueCardProps {
  issue: CivicIssue;
  rankIndex?: number;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, rankIndex }) => {
  const { supportIssue, userActivity } = useCivic();

  const isSupported = userActivity.supportedIssueIds.includes(issue.id);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getPriorityBadgeStyle = (score: number) => {
    if (score >= 80) return 'bg-amber-600 text-white';
    if (score >= 60) return 'bg-stone-800 text-stone-100';
    return 'bg-stone-200 text-stone-800';
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
      {/* Top Banner with Rank if provided */}
      <div>
        <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
          {/* Unsplash Photo */}
          <img
            src={issue.photo}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent"></div>

          {/* Rank Badge */}
          {rankIndex !== undefined && (
            <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur text-amber-400 border border-stone-700 text-xs font-mono font-bold px-2.5 py-1 rounded shadow-sm">
              #{String(rankIndex + 1).padStart(2, '0')}
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute top-3 right-3 bg-white/95 text-stone-800 text-xs font-semibold px-2.5 py-1 rounded border border-stone-200 shadow-sm">
            {issue.category}
          </div>

          {/* Bottom Title overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getSeverityStyle(issue.severity)} inline-block mb-1`}>
              {issue.severity} Severity
            </span>
            <h3 className="text-base font-bold text-white leading-snug drop-shadow-sm line-clamp-1">
              {issue.title}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{issue.location}</span>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
            <div className="bg-stone-50 p-2 rounded border border-stone-100">
              <span className="block text-[10px] text-stone-500 font-medium uppercase tracking-wider">
                Community Signal
              </span>
              <div className="flex items-baseline gap-1 text-stone-900">
                <span className="text-base font-bold font-mono">{issue.communityReports}</span>
                <span className="text-[11px] text-stone-600">reports</span>
              </div>
            </div>

            <div className="bg-stone-50 p-2 rounded border border-stone-100">
              <span className="block text-[10px] text-stone-500 font-medium uppercase tracking-wider">
                People Affected
              </span>
              <div className="flex items-baseline gap-1 text-stone-900">
                <span className="text-base font-bold font-mono">{issue.peopleAffected.toLocaleString()}</span>
                <span className="text-[11px] text-stone-600">people</span>
              </div>
            </div>
          </div>

          {/* Priority Score Bar & Status */}
          <div className="bg-stone-900 text-stone-100 p-3 rounded-md space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                  Civic Priority
                </span>
                <span className={`px-1.5 py-0.5 text-[11px] font-mono font-bold rounded ${getPriorityBadgeStyle(issue.priorityScore)}`}>
                  {issue.priorityScore} / 100
                </span>
              </div>
              <span className="text-[11px] font-medium text-amber-400 truncate max-w-[120px]">
                {issue.authority}
              </span>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mb-1">
                <span>Progress:</span>
                <span>{issue.progress}%</span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${issue.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => supportIssue(issue.id)}
          disabled={isSupported}
          className={`px-3 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            isSupported
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
              : 'bg-stone-900 hover:bg-stone-800 text-stone-100 shadow-sm active:scale-95'
          }`}
        >
          {isSupported ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Report Joined</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>I'm affected too</span>
            </>
          )}
        </button>

        <Link
          href={`/issues/${issue.id}`}
          className="px-3 py-2 rounded text-xs font-semibold border border-stone-300 hover:bg-stone-50 text-stone-800 flex items-center justify-center gap-1 transition-colors"
        >
          <span>View issue</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
        </Link>
      </div>
    </div>
  );
};
