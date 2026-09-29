'use client';

import React from 'react';
import Link from 'next/link';
import { Signal, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center text-stone-950 font-bold">
                <Signal className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-stone-200 text-base">CivicPulse</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 max-w-md">
              One report starts a signal. A community makes it visible. CivicPulse is a human-centered civic problem reporting platform that turns isolated citizen complaints into actionable collective signals for local administration.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Transparent Public Governance
              </span>
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-4 h-4 text-amber-500" /> Community Driven
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">Platform Workflow</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-stone-200 transition-colors">Community Dashboard</Link></li>
              <li><Link href="/issues" className="hover:text-stone-200 transition-colors">Ranked Issues Priority</Link></li>
              <li><Link href="/report" className="hover:text-stone-200 transition-colors">Submit Civic Report</Link></li>
              <li><Link href="/activity" className="hover:text-stone-200 transition-colors">Citizen Activity Ledger</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">Civic Feedback Loop</h4>
            <div className="text-xs text-stone-400 space-y-1.5 font-mono">
              <p>1. Report & Normalize</p>
              <p>2. Semantic Matching</p>
              <p>3. Community Impact Aggregation</p>
              <p>4. Dynamic Priority Calculation</p>
              <p>5. Municipal Escalation</p>
              <p>6. Resolution Verification</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} CivicPulse. Phase 1 Civic Technology Prototype. All rights reserved.</p>
          <p className="font-mono text-[11px] text-stone-500">
            Phase 1 Frontend Architecture • Mock Agent Orchestrator Connected
          </p>
        </div>
      </div>
    </footer>
  );
};
