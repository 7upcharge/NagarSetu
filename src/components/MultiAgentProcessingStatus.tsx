'use client';

import React from 'react';
import { Check } from 'lucide-react';

/**
 * Processing Status Component
 * Developer Note: This subtle citizen-facing section represents the underlying
 * multi-agent system execution (ReportAgent, MatchAgent, ImpactAgent, PriorityAgent, EscalationAgent).
 * Designed without AI clichés or technical jargon to maintain human trust.
 */
export const MultiAgentProcessingStatus: React.FC = () => {
  const steps = [
    { label: 'Report', status: 'completed' },
    { label: 'Matching', status: 'completed' },
    { label: 'Impact assessment', status: 'completed' },
    { label: 'Priority assessment', status: 'completed' },
    { label: 'Escalation check', status: 'completed' }
  ];

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold">
          Processing status
        </span>
        <span className="text-[10px] text-stone-600 font-mono">
          System Verification Active
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        {steps.map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-1 bg-white border border-stone-200 px-2.5 py-1 rounded text-stone-700 shadow-2xs"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
