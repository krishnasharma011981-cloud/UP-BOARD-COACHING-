/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { PageView } from '../types';

interface ExamCountdownWidgetProps {
  targetDateIso?: string;
  examTitle?: string;
  onNavigate: (page: PageView) => void;
  studentClass?: string;
}

export const ExamCountdownWidget: React.FC<ExamCountdownWidgetProps> = ({
  targetDateIso = '2027-02-18T08:30:00.000Z',
  examTitle,
  onNavigate,
  studentClass,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  const displayTitle =
    examTitle ||
    (studentClass === 'Class 10'
      ? 'UP Board High School (Class 10) Examination 2027'
      : studentClass === 'Class 12'
      ? 'UP Board Intermediate (Class 12) Examination 2027'
      : 'UP Board High School & Intermediate Examination 2027');

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
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0c1836] via-[#0f224d] to-[#0c1836] rounded-3xl p-5 sm:p-8 text-white shadow-2xl border border-blue-900/50">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="space-y-2.5 text-center lg:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold tracking-wide">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Official UPMSP Exam Countdown</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-[26px] font-heading font-extrabold text-white tracking-tight leading-snug">
            {displayTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Target 95%+ marks. Revise high-weightage derivations, solve official model papers,
            and complete previous 5-year question papers with teacher solutions.
          </p>
        </div>

        {/* Center 4 Countdown Numbers (Image 1 Style) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 shrink-0">
          {/* Days */}
          <div className="bg-[#18274c] border border-blue-800/40 rounded-2xl px-2.5 sm:px-4 py-2.5 sm:py-3.5 min-w-[62px] sm:min-w-[80px] flex flex-col items-center shadow-inner">
            <span className="text-xl sm:text-3xl font-heading font-extrabold text-amber-400 tabular-nums">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              DAYS
            </span>
          </div>

          <span className="text-slate-500 font-bold text-base sm:text-xl">:</span>

          {/* Hours */}
          <div className="bg-[#18274c] border border-blue-800/40 rounded-2xl px-2.5 sm:px-4 py-2.5 sm:py-3.5 min-w-[62px] sm:min-w-[80px] flex flex-col items-center shadow-inner">
            <span className="text-xl sm:text-3xl font-heading font-extrabold text-white tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              HOURS
            </span>
          </div>

          <span className="text-slate-500 font-bold text-base sm:text-xl">:</span>

          {/* Mins */}
          <div className="bg-[#18274c] border border-blue-800/40 rounded-2xl px-2.5 sm:px-4 py-2.5 sm:py-3.5 min-w-[62px] sm:min-w-[80px] flex flex-col items-center shadow-inner">
            <span className="text-xl sm:text-3xl font-heading font-extrabold text-white tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              MINS
            </span>
          </div>

          <span className="text-slate-500 font-bold text-base sm:text-xl">:</span>

          {/* Secs */}
          <div className="bg-[#18274c] border border-blue-800/40 rounded-2xl px-2.5 sm:px-4 py-2.5 sm:py-3.5 min-w-[62px] sm:min-w-[80px] flex flex-col items-center shadow-inner">
            <span className="text-xl sm:text-3xl font-heading font-extrabold text-amber-400 tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              SECS
            </span>
          </div>
        </div>

        {/* Action Button: View Date Sheet > */}
        <div className="shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('exam-calendar')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-400/25 hover:scale-[1.02] cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>View Date Sheet</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
