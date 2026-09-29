'use client';

import React from 'react';
import { CivicIssue } from '../types';
import { Users, AlertTriangle, MapPin, Building2, Landmark, ArrowRight, Share2 } from 'lucide-react';

export const CivicGraphMap: React.FC<{ issue: CivicIssue }> = ({ issue }) => {
  return (
    <div className="bg-stone-900 text-stone-100 rounded-xl p-6 border border-stone-800 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase text-amber-400 tracking-wider">
            Civic Graph Model
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Community connections
          </h3>
          <p className="text-xs text-stone-400">
            A human-readable relationship map of this problem across citizens, locations, and authorities.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 border border-stone-700 rounded text-[11px] font-mono text-stone-300">
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>7 Entity Relationship Triples Connected</span>
        </div>
      </div>

      {/* Visual Relationship Chain */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative py-2">
        {/* Node 1: Reporting Citizens */}
        <div className="bg-stone-950 border border-stone-800 rounded-lg p-3.5 flex flex-col items-center text-center justify-between">
          <div className="w-10 h-10 rounded-full bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-400 mb-2">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold font-mono text-white">{issue.communityReports} People</div>
          <div className="text-[11px] text-stone-400 mt-1">Directly Reported</div>
          <div className="mt-2 px-2 py-0.5 bg-stone-900 text-[10px] text-amber-400 rounded font-mono border border-stone-800">
            Person → reported
          </div>
        </div>

        {/* Node 2: The Core Problem */}
        <div className="bg-amber-950/40 border border-amber-700/60 rounded-lg p-3.5 flex flex-col items-center text-center justify-between">
          <div className="w-10 h-10 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center mb-2 font-bold">
            <AlertTriangle className="w-5 h-5 text-stone-950" />
          </div>
          <div className="text-xs font-bold text-amber-200 line-clamp-1">{issue.category} Issue</div>
          <div className="text-[11px] text-amber-300/80 font-mono">ID: #{issue.id.replace('issue-', '')}</div>
          <div className="mt-2 px-2 py-0.5 bg-amber-900/60 text-[10px] text-amber-300 rounded font-mono border border-amber-700/50">
            Problem Node
          </div>
        </div>

        {/* Node 3: Affected Locations */}
        <div className="bg-stone-950 border border-stone-800 rounded-lg p-3.5 flex flex-col items-center text-center justify-between">
          <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 mb-2">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold font-mono text-white">{issue.locationsAffected} Locations</div>
          <div className="text-[11px] text-stone-400 mt-1">In Impact Radius</div>
          <div className="mt-2 px-2 py-0.5 bg-stone-900 text-[10px] text-stone-400 rounded font-mono border border-stone-800">
            Problem → located_at
          </div>
        </div>

        {/* Node 4: Affected Community */}
        <div className="bg-stone-950 border border-stone-800 rounded-lg p-3.5 flex flex-col items-center text-center justify-between">
          <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400 mb-2">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold font-mono text-white">{issue.peopleAffected.toLocaleString()} People</div>
          <div className="text-[11px] text-stone-400 mt-1">Affected Community</div>
          <div className="mt-2 px-2 py-0.5 bg-stone-900 text-[10px] text-emerald-400 rounded font-mono border border-stone-800">
            Problem → affects
          </div>
        </div>

        {/* Node 5: Primary Local Admin */}
        <div className="bg-stone-950 border border-stone-800 rounded-lg p-3.5 flex flex-col items-center text-center justify-between">
          <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-sky-400 mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-stone-200">College Admin</div>
          <div className="text-[11px] text-stone-400 mt-1">Local Response</div>
          <div className="mt-2 px-2 py-0.5 bg-stone-900 text-[10px] text-sky-400 rounded font-mono border border-stone-800">
            escalated_to
          </div>
        </div>

        {/* Node 6: Municipal Authority */}
        <div className="bg-stone-950 border border-amber-600/40 rounded-lg p-3.5 flex flex-col items-center text-center justify-between">
          <div className="w-10 h-10 rounded-full bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-400 mb-2">
            <Landmark className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-amber-300">Municipal Corp</div>
          <div className="text-[11px] text-stone-400 mt-1">City Jurisdiction</div>
          <div className="mt-2 px-2 py-0.5 bg-amber-950 text-[10px] text-amber-300 rounded font-mono border border-amber-800">
            responsible_for
          </div>
        </div>
      </div>

      <div className="text-[11px] text-stone-400 font-mono bg-stone-950 p-3 rounded border border-stone-800 flex items-center justify-between">
        <span>Graph Relationship Triples: Person [87] ──(supports)──► Problem ──(escalated_to)──► Authority [{issue.authority}]</span>
        <span className="text-emerald-400 font-bold">Signal Active</span>
      </div>
    </div>
  );
};
