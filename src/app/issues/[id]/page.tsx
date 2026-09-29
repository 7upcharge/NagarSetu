'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCivic } from '../../../context/CivicContext';
import { CivicGraphMap } from '../../../components/CivicGraphMap';
import { EscalationTimeline } from '../../../components/EscalationTimeline';
import { MultiAgentProcessingStatus } from '../../../components/MultiAgentProcessingStatus';
import { ArrowLeft, MapPin, Calendar, UserPlus, CheckCircle2, Building2, ShieldAlert, Users, Layers, ExternalLink } from 'lucide-react';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getIssueById, supportIssue, userActivity } = useCivic();

  const issueId = params?.id as string;
  const issue = getIssueById(issueId);

  if (!issue) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Issue Not Found</h2>
        <p className="text-xs text-stone-600">The requested civic problem ID does not exist or was removed.</p>
        <Link
          href="/issues"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-amber-400 text-xs font-semibold rounded"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Community Issues
        </Link>
      </div>
    );
  }

  const isSupported = userActivity.supportedIssueIds.includes(issue.id);

  // Driver bars calculation
  const reportPercentage = Math.min(100, Math.round((issue.communityReports / 100) * 100));
  const affectedPercentage = Math.min(100, Math.round((issue.peopleAffected / 2000) * 100));
  const severityScoreMap: Record<string, number> = { Critical: 100, High: 75, Moderate: 50, Low: 25 };
  const severityPercentage = severityScoreMap[issue.severity] || 50;

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/issues"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Community Issues
        </Link>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="relative h-72 sm:h-96 w-full bg-stone-900">
          <img
            src={issue.photo}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 bg-white/95 text-stone-900 text-xs font-bold rounded-md shadow-sm">
              {issue.category}
            </span>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-md border ${
                issue.severity === 'Critical'
                  ? 'bg-red-900 text-red-100 border-red-700'
                  : issue.severity === 'High'
                  ? 'bg-amber-900 text-amber-100 border-amber-700'
                  : 'bg-stone-800 text-stone-100 border-stone-700'
              }`}
            >
              {issue.severity} Severity
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{issue.location}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
              {issue.title}
            </h1>
          </div>
        </div>

        {/* Action Header Strip */}
        <div className="p-6 bg-stone-900 text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-600 flex items-center justify-center font-mono text-xl font-bold text-stone-950">
              {issue.priorityScore}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-mono text-stone-400">
                Current Priority Score
              </div>
              <div className="text-sm font-semibold text-stone-200">
                Routed to: <span className="text-amber-400 font-bold">{issue.authority}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => supportIssue(issue.id)}
            disabled={isSupported}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              isSupported
                ? 'bg-emerald-900 text-emerald-200 border border-emerald-700 cursor-default'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-md active:scale-95'
            }`}
          >
            {isSupported ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>You are connected to this report</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-stone-950" />
                <span>I'm affected too</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Issue Description Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              Problem Description
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {issue.description}
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Reported: {new Date(issue.createdAt).toLocaleDateString()}
              </span>
              <span>Coordinates: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</span>
            </div>
          </div>

          {/* Community Signal Breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              COMMUNITY SIGNAL
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg text-center">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-stone-900">
                  {issue.communityReports}
                </span>
                <span className="text-xs text-stone-600 font-medium">Community Reports</span>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg text-center">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-stone-900">
                  {issue.peopleAffected.toLocaleString()}
                </span>
                <span className="text-xs text-stone-600 font-medium">People Affected</span>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg text-center">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-stone-900">
                  {issue.locationsAffected}
                </span>
                <span className="text-xs text-stone-600 font-medium">Locations Affected</span>
              </div>
            </div>
          </div>

          {/* Priority Engine Drivers */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                  PRIORITY ENGINE BREAKDOWN
                </h3>
                <p className="text-xs text-stone-600">
                  Major drivers behind this issue's priority score calculation ({issue.priorityScore} / 100).
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-mono font-bold text-sm rounded border border-amber-300">
                {issue.priorityScore} / 100
              </span>
            </div>

            <div className="space-y-4">
              {/* Driver 1: Community Reports */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                  <span>Community Reports (Weight 35%)</span>
                  <span className="font-mono">{issue.communityReports} reports</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-amber-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${reportPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Driver 2: People Affected */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                  <span>People Affected (Weight 40%)</span>
                  <span className="font-mono">{issue.peopleAffected.toLocaleString()} people</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-stone-800 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${affectedPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Driver 3: Severity */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
                  <span>Severity Scale (Weight 20%)</span>
                  <span className="font-mono">{issue.severity} Level</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-red-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${severityPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Civic Graph Visualization */}
          <CivicGraphMap issue={issue} />
        </div>

        {/* Right Column (1/3 width): Timeline & Status */}
        <div className="space-y-8">
          {/* Subtle Multi-Agent Processing Status */}
          <MultiAgentProcessingStatus />

          {/* Escalation Timeline Component */}
          <EscalationTimeline timeline={issue.timeline} />

          {/* Real World Escalation Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Real-World Escalation Protocol</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              This prototype simulates automated municipal routing for Ward 12. In full production, issues reaching score 75+ generate structured dispatch notifications via official API gateways.
            </p>
            <div className="pt-2 text-[11px] font-mono text-amber-900/80 font-semibold border-t border-amber-200/80">
              Current Dispatch: Municipal Corporation — Demo Status
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
