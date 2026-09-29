'use client';

import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { Sliders, RotateCcw, TrendingUp, AlertTriangle, ArrowUpRight, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Severity } from '../types';

export const DemoControlsDrawer: React.FC<{ targetIssueId?: string }> = ({ targetIssueId }) => {
  const {
    issues,
    simulateImpact,
    simulateSeverity,
    simulateEscalation,
    simulateAction,
    simulateResolution,
    resetDemo
  } = useCivic();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(targetIssueId || issues[0]?.id || 'issue-1');

  const activeIssue = issues.find((i) => i.id === selectedId) || issues[0];

  const handleImpact = (reportsDelta: number, affectedDelta: number) => {
    if (!activeIssue) return;
    simulateImpact(activeIssue.id, reportsDelta, affectedDelta);
  };

  const handleSeverityChange = () => {
    if (!activeIssue) return;
    const nextSeverityMap: Record<Severity, Severity> = {
      Low: 'Moderate',
      Moderate: 'High',
      High: 'Critical',
      Critical: 'Low'
    };
    simulateSeverity(activeIssue.id, nextSeverityMap[activeIssue.severity]);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-stone-900 text-stone-200 hover:text-amber-400 border border-stone-700 px-3.5 py-2 rounded-lg text-xs font-mono font-medium shadow-lg flex items-center gap-2 hover:bg-stone-800 transition-all"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-500" />
          <span>Demo Controls</span>
        </button>
      ) : (
        <div className="bg-stone-900 text-stone-100 border border-stone-700 rounded-xl shadow-2xl p-4 max-w-sm w-full animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono font-bold tracking-wide uppercase text-stone-300">
                Civic Loop Simulator
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-200 p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-stone-400 mb-1">
                Target Civic Problem:
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full text-xs bg-stone-800 text-stone-200 border border-stone-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
              >
                {issues.map((issue) => (
                  <option key={issue.id} value={issue.id}>
                    #{issue.id.replace('issue-', '')} — {issue.title.slice(0, 32)}... (P:{issue.priorityScore})
                  </option>
                ))}
              </select>
            </div>

            {activeIssue && (
              <div className="bg-stone-950 p-2.5 rounded border border-stone-800 text-xs font-mono space-y-1">
                <div className="flex justify-between text-stone-300 font-semibold">
                  <span className="truncate max-w-[180px]">{activeIssue.title}</span>
                  <span className="text-amber-400">Score: {activeIssue.priorityScore}</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Reports: {activeIssue.communityReports}</span>
                  <span>Affected: {activeIssue.peopleAffected}</span>
                  <span className="text-stone-300 font-bold">{activeIssue.severity}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                onClick={() => handleImpact(10, 0)}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>+10 Reports</span>
              </button>

              <button
                onClick={() => handleImpact(0, 100)}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                <span>+100 Affected</span>
              </button>

              <button
                onClick={handleSeverityChange}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Next Severity</span>
              </button>

              <button
                onClick={() => activeIssue && simulateEscalation(activeIssue.id)}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                <span>Escalate Issue</span>
              </button>

              <button
                onClick={() => activeIssue && simulateAction(activeIssue.id)}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Start Action</span>
              </button>

              <button
                onClick={() => activeIssue && simulateResolution(activeIssue.id)}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resolve Issue</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={resetDemo}
              className="text-[11px] font-mono text-stone-400 hover:text-red-400 flex items-center gap-1 py-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Seed State</span>
            </button>
            <span className="text-[10px] text-stone-500 font-mono">Loop Engine v1.0</span>
          </div>
        </div>
      )}
    </div>
  );
};
