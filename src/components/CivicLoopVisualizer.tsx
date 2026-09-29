'use client';

import React from 'react';
import { FileText, Users, TrendingUp, ShieldAlert, Wrench, CheckCircle } from 'lucide-react';

export const CivicLoopVisualizer: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'REPORT',
      icon: <FileText className="w-5 h-5 text-stone-700" />,
      text: 'A citizen files a problem or joins an existing nearby issue.'
    },
    {
      num: '02',
      title: 'COMMUNITY',
      icon: <Users className="w-5 h-5 text-stone-700" />,
      text: 'Affected neighbors confirm the issue to build a collective signal.'
    },
    {
      num: '03',
      title: 'PRIORITY',
      icon: <TrendingUp className="w-5 h-5 text-stone-700" />,
      text: 'Priority engine continuously recalculates urgency based on scale.'
    },
    {
      num: '04',
      title: 'ESCALATION',
      icon: <ShieldAlert className="w-5 h-5 text-stone-700" />,
      text: 'Automated thresholding routes issue to college or municipal authority.'
    },
    {
      num: '05',
      title: 'ACTION',
      icon: <Wrench className="w-5 h-5 text-stone-700" />,
      text: 'Responsible agency acknowledges dispatch and initiates repair work.'
    },
    {
      num: '06',
      title: 'RESOLUTION',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      text: 'Work completed and verified directly by the local community.'
    }
  ];

  return (
    <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="max-w-2xl">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
          The Civic Feedback Loop
        </span>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-2">
          How a report moves
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          CivicPulse isn't a static complaint inbox. It is a living feedback loop that amplifies individual reports into visible civic urgency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative pt-2">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex flex-col justify-between relative group hover:border-amber-400 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  {step.num}
                </span>
                <div className="p-2 rounded bg-white border border-stone-200 shadow-2xs">
                  {step.icon}
                </div>
              </div>

              <h4 className="text-xs font-bold font-mono tracking-wider text-stone-900 uppercase mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-stone-600 leading-normal">
                {step.text}
              </p>
            </div>

            {/* Connecting Arrow for larger screens */}
            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-stone-400 font-mono text-sm">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-stone-900 text-stone-300 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="font-mono text-stone-200 font-medium">
            Continuous Loop Status: 100% Deterministic Signal Tracking Active
          </span>
        </div>
        <span className="text-stone-400 text-[11px]">
          No reports get lost in silence.
        </span>
      </div>
    </section>
  );
};
