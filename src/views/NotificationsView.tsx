/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  ExternalLink,
  Download,
  AlertTriangle,
  FileText,
  Filter,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { UpNotificationItem, PageView } from '../types';
import { ExamCountdownWidget } from '../components/ExamCountdownWidget';
import { storageService } from '../services/storageService';

interface NotificationsViewProps {
  notifications: UpNotificationItem[];
  onNavigate: (page: PageView) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');

  const filtered = notifications.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesCls = selectedClass === 'All' || n.relevantClass.includes(selectedClass) || n.relevantClass === 'All Classes';
    return matchesCat && matchesCls;
  });

  const handleDownloadNotice = (item: UpNotificationItem) => {
    storageService.downloadResource(item.title, 'pdf', {
      summary: `${item.titleHindi}\n${item.description}`,
      keyTopics: [`Category: ${item.category}`, `Official Source: ${item.officialSourceUrl}`, `Published Date: ${item.publishDate}`],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Official UPMSP Notice Board
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight mt-1">
            UP Board Official Notifications & Exam Updates
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Verified official circulars, examination timetable date sheet, practical exams schedule, admit card instructions, and syllabus announcements from UPMSP Prayagraj.
          </p>
        </div>

        <a
          href="https://upmsp.edu.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors shrink-0"
        >
          <span>Visit Official upmsp.edu.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Prominent Live Exam Countdown Widget */}
      <ExamCountdownWidget onNavigate={onNavigate} />

      {/* Category and Class Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-slate-500 font-medium mr-1">Category:</span>
            {['All', 'Time Table', 'Practical Exams', 'Model Paper', 'Registration', 'Admit Card'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Classes */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium mr-1">For Class:</span>
            {['All', '10', '12', '9', '11'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cls === 'All' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Cards Feed */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-2xl border transition-all ${
              item.isUrgent
                ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {item.isUrgent && (
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Urgent Notice
                    </span>
                  )}
                  <span className="font-bold text-blue-900 bg-blue-100/70 px-2.5 py-0.5 rounded text-[11px]">
                    {item.category}
                  </span>
                  <span className="text-slate-500 font-medium text-[11px]">
                    Applies to: {item.relevantClass}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Published: {item.publishDate}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <h4 className="text-sm font-semibold text-blue-900">
                  {item.titleHindi}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 max-w-4xl">
                  {item.description}
                </p>
              </div>

              {/* Action Column */}
              <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => handleDownloadNotice(item)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Notice</span>
                </button>

                <a
                  href={item.officialSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  <span>UPMSP Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
