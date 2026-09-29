'use client';

import React from 'react';
import { TimelineEvent } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export const EscalationTimeline: React.FC<{ timeline: TimelineEvent[] }> = ({ timeline }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Escalation Progress
        </span>
        <h3 className="text-lg font-bold text-stone-900 tracking-tight mt-1">
          Escalation Timeline
        </h3>
        <p className="text-xs text-stone-600">
          Live stage tracking showing official routing from community report to verified resolution.
        </p>
      </div>

      <div className="relative pl-6 border-l-2 border-stone-200 space-y-6 pt-2">
        {timeline.map((event, idx) => {
          const isCompleted = event.completed;
          const isCurrent = event.current;

          return (
            <div key={event.id || idx} className="relative group">
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCurrent
                    ? 'bg-amber-600 border-amber-600 text-white ring-4 ring-amber-100'
                    : isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-stone-300 text-stone-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Event Content */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-amber-800 font-mono uppercase tracking-wide'
                          : isCompleted
                          ? 'text-stone-900'
                          : 'text-stone-400 font-normal'
                      }`}
                    >
                      {event.label}
                    </h4>

                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-600 text-white rounded uppercase">
                        Current Status
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-xs text-stone-600 mt-0.5">{event.description}</p>
                  )}
                </div>

                <span className="text-xs font-mono text-stone-600 shrink-0">
                  {event.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
