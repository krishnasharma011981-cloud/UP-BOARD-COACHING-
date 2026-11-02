/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Share2,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { UpNotificationItem, PageView } from '../types';
import { ExamCountdownWidget } from '../components/ExamCountdownWidget';
import { storageService } from '../services/storageService';
import { upmspService, UpmspSyncResult } from '../services/upmspService';

interface NotificationsViewProps {
  notifications: UpNotificationItem[];
  onNavigate: (page: PageView) => void;
  onRefreshData?: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications: initialNotifications,
  onNavigate,
  onRefreshData,
}) => {
  const [notifications, setNotifications] = useState<UpNotificationItem[]>(initialNotifications);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<UpmspSyncResult | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => upmspService.getLastSyncTime() || 'Just now');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Subscribe to live UPMSP real-time feed updates
  useEffect(() => {
    const unsubscribe = upmspService.subscribe((liveList) => {
      setNotifications(liveList);
    });

    // Auto-fetch on mount to guarantee fresh board circulars
    upmspService.fetchLiveUpdates().then((res) => {
      if (res.newCount > 0) {
        setSyncResult(res);
        setLastSyncTime(res.lastSyncTime);
        if (onRefreshData) onRefreshData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [onRefreshData]);

  // Keep in sync with parent prop updates
  useEffect(() => {
    if (initialNotifications && initialNotifications.length > 0) {
      setNotifications(initialNotifications);
    }
  }, [initialNotifications]);

  const filtered = notifications.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesCls =
      selectedClass === 'All' ||
      n.relevantClass.toLowerCase().includes(selectedClass.toLowerCase()) ||
      n.relevantClass === 'All Classes';
    return matchesCat && matchesCls;
  });

  const handleDownloadNotice = (item: UpNotificationItem) => {
    storageService.downloadResource(item.title, 'pdf', {
      summary: `${item.titleHindi}\n\n${item.description}`,
      keyTopics: [
        `Category: ${item.category}`,
        `Official Board: Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP Prayagraj)`,
        `Official Source: ${item.officialSourceUrl}`,
        `Published Date: ${item.publishDate}`,
        `Applicable To: ${item.relevantClass}`,
      ],
    });
  };

  const handleCopyNotice = (item: UpNotificationItem) => {
    const textToCopy = `📢 UPMSP Official Notice:\n${item.title}\n${item.titleHindi}\nOfficial Portal: ${item.officialSourceUrl}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSyncWithUpmsp = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const res = await upmspService.fetchLiveUpdates();
      setSyncResult(res);
      setLastSyncTime(res.lastSyncTime);
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err) {
      console.error('UPMSP manual sync failed:', err);
    } finally {
      setIsSyncing(false);
      setTimeout(() => {
        setSyncResult(null);
      }, 6000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Live Status Bar */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                LIVE UPMSP Prayagraj Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-slate-300">
                upmsp.edu.in
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated sync with Uttar Pradesh Madhyamik Shiksha Parishad circulars, exam dates & RSS feeds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={handleSyncWithUpmsp}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Fetching upmsp.edu.in...' : 'Fetch UPMSP Updates'}</span>
          </button>

          <a
            href="https://upmsp.edu.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Official Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-400 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-600" />
              Official Board Bulletins
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Last Verified: {lastSyncTime}
            </span>
          </div>

          <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            UP Board Official Notifications & Exam Updates
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Real-time notifications synchronized directly from Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP Prayagraj). Verified official circulars, 2027 examination timetable, admit cards, and center guidelines.
          </p>
        </div>
      </div>

      {/* Sync Success / Result Banner */}
      {syncResult && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncResult.message}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
            Source: {syncResult.source === 'live-rss' ? 'Live RSS Feed' : 'UPMSP Official Circulars'}
          </span>
        </div>
      )}

      {/* Prominent Live Exam Countdown Widget */}
      <ExamCountdownWidget onNavigate={onNavigate} />

      {/* Category and Class Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Category:
          </span>
          {[
            'All',
            'Time Table',
            'Admit Card',
            'Model Paper',
            'Practical Exams',
            'Registration',
            'Syllabus',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Classes */}
        <div className="flex flex-wrap items-center gap-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-slate-500 dark:text-slate-400 font-semibold mr-1">
            Applicable Level:
          </span>
          {[
            { id: 'All', label: 'All Classes' },
            { id: '12', label: '12 - senior secondary' },
            { id: '10', label: '10 - secondary' },
            { id: '11', label: '11 - pre senior secondary' },
            { id: '9', label: '9 - pre secondary' },
          ].map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
                selectedClass === cls.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cls.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Cards Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Bell className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-200">
              No circulars found in this filter
            </h3>
            <p className="text-xs text-slate-500">
              Try selecting "All" or click "Fetch UPMSP Updates" to refresh the live bulletin feed.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedClass('All');
              }}
              className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all ${
                item.isUrgent
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
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
                    <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Published: {item.publishDate}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified UPMSP
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
                <div className="flex flex-row md:flex-col items-stretch gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleDownloadNotice(item)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download PDF</span>
                  </button>

                  <a
                    href={item.officialSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                  >
                    <span>UPMSP Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <button
                    onClick={() => handleCopyNotice(item)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
                    title="Share notice"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
