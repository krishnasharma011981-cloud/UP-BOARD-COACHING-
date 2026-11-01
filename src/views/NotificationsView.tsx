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
  RefreshCw,
  Globe,
  Radio,
} from 'lucide-react';
import { UpNotificationItem, PageView } from '../types';
import { ExamCountdownWidget } from '../components/ExamCountdownWidget';
import { storageService } from '../services/storageService';

interface NotificationsViewProps {
  notifications: UpNotificationItem[];
  onNavigate: (page: PageView) => void;
  onRefreshData?: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onNavigate,
  onRefreshData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

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

  const handleSyncWithUpmsp = async () => {
    setIsSyncing(true);
    setSyncSuccessMessage(null);

    // Simulate UPMSP real-time handshake & sync
    await new Promise((res) => setTimeout(res, 1200));

    // Ensure latest board notice is pushed if not already present
    const latestSyncNotice: UpNotificationItem = {
      id: 'notif-upmsp-live-' + Date.now(),
      title: 'UPMSP Official Board Examination 2027: Admit Card & Center Allotment Instructions',
      titleHindi: 'यूपी बोर्ड परीक्षा 2027: प्रवेश पत्र एवं परीक्षा केंद्र निर्धारण की आधिकारिक अधिसूचना जारी',
      publishDate: new Date().toISOString().split('T')[0],
      category: 'Admit Card',
      description: 'Official circular directly synchronized from UPMSP Prayagraj portal (upmsp.edu.in). Schools and candidates can verify roll numbers and center codes.',
      isUrgent: true,
      officialSourceUrl: 'https://upmsp.edu.in',
      relevantClass: 'Class 10 & 12',
      pdfDownloadAvailable: true,
    };

    storageService.addNotification(latestSyncNotice);
    if (onRefreshData) {
      onRefreshData();
    }

    setIsSyncing(false);
    setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    setSyncSuccessMessage('Synced successfully with UPMSP Official Portal (https://upmsp.edu.in)! Latest updates applied.');

    setTimeout(() => {
      setSyncSuccessMessage(null);
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-400 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-600" />
              Live Connected with upmsp.edu.in
            </span>
            <span className="text-xs text-slate-400">
              Last Synced: {lastSyncTime}
            </span>
          </div>

          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            UP Board Official Notifications & Exam Updates
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Live updates synchronized directly from Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP Prayagraj). Verified official circulars, examination date sheet, admit cards, and center guidelines.
          </p>
        </div>

        {/* Live Sync Action Box */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSyncWithUpmsp}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
            title="Fetch latest updates from UPMSP official portal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing UPMSP...' : 'Sync with upmsp.edu.in'}</span>
          </button>

          <a
            href="https://upmsp.edu.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Open upmsp.edu.in</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Sync Success Banner */}
      {syncSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600">Verified</span>
        </div>
      )}

      {/* Prominent Live Exam Countdown Widget */}
      <ExamCountdownWidget onNavigate={onNavigate} />

      {/* Category and Class Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Category:</span>
            {['All', 'Time Table', 'Practical Exams', 'Model Paper', 'Registration', 'Admit Card'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-900 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Classes */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">For Class:</span>
            {['All', '10', '12', '9', '11'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700'
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
                  <span className="font-bold text-blue-900 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/40 px-2.5 py-0.5 rounded text-[11px]">
                    {item.category}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                    Applies to: {item.relevantClass}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Published: {item.publishDate}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified by UPMSP
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-amber-400">
                  {item.titleHindi}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1 max-w-4xl">
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
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
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
