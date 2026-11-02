/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  AlertTriangle,
  Home,
  Video,
  FileText,
  Sparkles,
  ArrowLeft,
  Compass,
  Search,
  BookOpen,
  GraduationCap,
  Bell,
  Download,
} from 'lucide-react';
import { PageView } from '../types';

interface NotFoundViewProps {
  onNavigate: (page: PageView) => void;
  attemptedPath?: string;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onNavigate,
  attemptedPath = typeof window !== 'undefined' ? window.location.pathname : '',
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* Status Codes Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold tracking-wide uppercase">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Status 202 / 404 • Resource Not Found</span>
        </div>

        {/* Big Impact Numbers */}
        <div className="relative">
          <div className="text-8xl sm:text-9xl font-heading font-black tracking-tighter text-slate-200 dark:text-slate-800/80 select-none">
            202
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-white">
              Page Not Found
            </span>
            <span className="text-sm sm:text-base font-semibold text-red-600 dark:text-red-400 mt-1">
              माफ़ कीजिए! यह पृष्ठ या चैप्टर लिंक उपलब्ध नहीं है
            </span>
          </div>
        </div>

        {/* Explanation text */}
        <div className="max-w-xl mx-auto space-y-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          <p>
            The requested coaching route{' '}
            <code className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">
              {attemptedPath || '/page-not-found'}
            </code>{' '}
            could not be located on UP BOARD COACHING servers.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            हो सकता है कि यूआरएल (URL) में कोई टाइपिंग मिस्टेक हो या यह क्लास/नोट्स किसी अन्य सेक्शन में स्थानांतरित कर दिया गया हो।
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-heading font-bold text-sm shadow-xl shadow-blue-900/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Go to Home (मुख्य पृष्ठ)</span>
          </button>

          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                onNavigate('home');
              }
            }}
            className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-heading font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Page (पीछे जाएँ)</span>
          </button>
        </div>

        {/* Popular UP Board Shortcuts Grid */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
          <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
            <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Popular UP Board Portals & Sections (लोकप्रिय लिंक्स)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('live-classes')}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-heading font-bold text-xs text-slate-900 dark:text-white">
                  Live Classes & Lectures
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Daily YouTube Live Streaming
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('live-quiz')}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-heading font-bold text-xs text-slate-900 dark:text-white">
                  Daily 50 Live Quiz
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Interactive OMR Practice
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('study-material')}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-heading font-bold text-xs text-slate-900 dark:text-white">
                  Notes & PPTs
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Topper Handwritten Notes
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('class-12')}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-heading font-bold text-xs text-slate-900 dark:text-white">
                  12 - Senior Secondary
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Physics, Chemistry, Maths
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('class-10')}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-heading font-bold text-xs text-slate-900 dark:text-white">
                  10 - Secondary
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Maths, Science, Hindi
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('notifications')}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-heading font-bold text-xs text-slate-900 dark:text-white">
                  UPMSP Circulars
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Prayagraj Board Updates
                </span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
