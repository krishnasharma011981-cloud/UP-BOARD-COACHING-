/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import { PageView } from '../types';

interface ExamCountdownWidgetProps {
  targetDateIso?: string;
  examTitle?: string;
  onNavigate: (page: PageView) => void;
}

export const ExamCountdownWidget: React.FC<ExamCountdownWidgetProps> = ({
  targetDateIso = '2027-02-18T08:30:00.000Z',
  examTitle = 'UP Board High School & Intermediate Examination 2027',
  onNavigate,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDateIso).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateIso]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/40">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Official UPMSP Exam Countdown</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
            {examTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Target 95%+ marks. Revise high-weightage derivations, solve official model papers,
            and complete previous 5-year question papers with teacher solutions.
          </p>
        </div>

        {/* Center / Right Countdown Numbers */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 w-full sm:w-auto max-w-full">
          <div className="flex-1 sm:flex-initial flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-2 sm:px-4 py-2 sm:py-3 min-w-[55px] sm:min-w-[80px]">
            <span className="text-xl sm:text-3xl font-heading font-extrabold text-amber-400 tabular-nums">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-xs uppercase font-medium tracking-wider text-slate-300">
              Days
            </span>
          </div>

          <div className="text-lg sm:text-xl font-bold text-slate-500">:</div>

          <div className="flex-1 sm:flex-initial flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-2 sm:px-4 py-2 sm:py-3 min-w-[55px] sm:min-w-[80px]">
            <span className="text-xl sm:text-3xl font-heading font-extrabold text-white tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-xs uppercase font-medium tracking-wider text-slate-300">
              Hours
            </span>
          </div>

          <div className="text-lg sm:text-xl font-bold text-slate-500">:</div>

          <div className="flex-1 sm:flex-initial flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-2 sm:px-4 py-2 sm:py-3 min-w-[55px] sm:min-w-[80px]">
            <span className="text-xl sm:text-3xl font-heading font-extrabold text-white tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-xs uppercase font-medium tracking-wider text-slate-300">
              Mins
            </span>
          </div>

          <div className="text-lg sm:text-xl font-bold text-slate-500 hidden sm:block">:</div>

          <div className="hidden sm:flex flex-1 sm:flex-initial flex-col items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-2 sm:px-4 py-2 sm:py-3 min-w-[55px] sm:min-w-[80px]">
            <span className="text-xl sm:text-3xl font-heading font-extrabold text-amber-400 tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-xs uppercase font-medium tracking-wider text-slate-300">
              Secs
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <button
            onClick={() => onNavigate('exam-calendar')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs transition-colors shadow-lg shadow-amber-400/20 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>View Date Sheet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
