'use client';

import React from 'react';
import { useCivic } from '../context/CivicContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { notification, clearNotification } = useCivic();

  if (!notification) return null;

  const bgStyle =
    notification.type === 'success'
      ? 'bg-stone-900 border-emerald-600 text-stone-100'
      : notification.type === 'warning'
      ? 'bg-stone-900 border-amber-600 text-stone-100'
      : 'bg-stone-900 border-stone-700 text-stone-100';

  const icon =
    notification.type === 'success' ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
    ) : notification.type === 'warning' ? (
      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
    ) : (
      <Info className="w-5 h-5 text-sky-400 shrink-0" />
    );

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`p-4 rounded-lg border-2 shadow-xl flex items-start justify-between gap-3 ${bgStyle}`}>
        <div className="flex items-start gap-3">
          {icon}
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-0.5">
              Civic Engine Update
            </p>
            <p className="text-sm font-medium leading-snug">{notification.message}</p>
          </div>
        </div>
        <button
          onClick={clearNotification}
          className="text-stone-400 hover:text-stone-200 p-1 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
