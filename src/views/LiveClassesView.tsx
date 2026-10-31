/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Video,
  Play,
  Calendar,
  Clock,
  Download,
  Users,
  Bell,
  CheckCircle2,
  Share2,
  Sparkles,
  ExternalLink,
  Presentation,
  FileText,
} from 'lucide-react';
import { LiveClassItem, ClassLevel } from '../types';
import { TEACHER_STUDIO_IMAGE } from '../data/mockData';
import { storageService } from '../services/storageService';

interface LiveClassesViewProps {
  liveClasses: LiveClassItem[];
  onOpenPlayer: (item: LiveClassItem) => void;
  reminders: string[];
  onToggleReminder: (id: string) => void;
  onNavigateToAdmin: () => void;
}

export const LiveClassesView: React.FC<LiveClassesViewProps> = ({
  liveClasses,
  onOpenPlayer,
  reminders,
  onToggleReminder,
  onNavigateToAdmin,
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<'All' | ClassLevel>('All');

  const activeLiveClass = liveClasses.find((c) => c.isLiveNow);
  const upcomingClasses = liveClasses.filter((c) => !c.isLiveNow && !c.isCompleted);
  const completedRecordings = liveClasses.filter((c) => c.isCompleted);

  const filteredUpcoming = selectedClassFilter === 'All'
    ? upcomingClasses
    : upcomingClasses.filter((c) => c.classLevel === selectedClassFilter);

  const filteredCompleted = selectedClassFilter === 'All'
    ? completedRecordings
    : completedRecordings.filter((c) => c.classLevel === selectedClassFilter);

  const handleDownload = (liveClass: LiveClassItem, type: 'notes' | 'ppt') => {
    storageService.downloadResource(`${liveClass.title} - ${type.toUpperCase()}`, type, {
      summary: liveClass.description,
      keyTopics: [liveClass.chapterTopic, 'Formulas & Definitions', 'Board Model Derivations'],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>YouTube Live Interactive Classroom</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            UP Board Live Classes & Recorded Lectures
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Join daily live streaming sessions with UP Board expert faculty. Watch recordings anytime, ask doubts in live chat, and download every lecture's PPT & notes for free.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['All', 'Class 12', 'Class 11', 'Class 10', 'Class 9'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedClassFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedClassFilter === lvl
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* CURRENTLY LIVE FEATURED STREAM BANNER */}
      {activeLiveClass && (
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-red-500/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Stream player preview */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl group">
                <iframe
                  src={`https://www.youtube.com/embed/${activeLiveClass.youtubeVideoId}?autoplay=0&rel=0`}
                  title={activeLiveClass.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
                
                {/* Floating Live Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-bold tracking-wider flex items-center gap-1.5 uppercase shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    BROADCASTING LIVE
                  </span>
                  <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-xs text-xs font-semibold text-slate-200">
                    <Users className="w-3.5 h-3.5 inline mr-1 text-red-400" />
                    {activeLiveClass.viewersCount.toLocaleString('en-IN')} students watching
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                  <span>{activeLiveClass.classLevel}</span>
                  <span>·</span>
                  <span>{activeLiveClass.subject}</span>
                  <span>·</span>
                  <span>{activeLiveClass.chapterTopic}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white leading-tight">
                  {activeLiveClass.title}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeLiveClass.description}
                </p>
              </div>

              {/* Teacher Info */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center">
                  ER
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{activeLiveClass.teacherName}</p>
                  <p className="text-[11px] text-slate-400">{activeLiveClass.teacherRole}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => onOpenPlayer(activeLiveClass)}
                  className="w-full py-3 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Join Live Interactive Class & Chat</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownload(activeLiveClass, 'notes')}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Download PDF Notes</span>
                  </button>

                  <button
                    onClick={() => handleDownload(activeLiveClass, 'ppt')}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Presentation className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download Lecture PPT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING LIVE CLASSES SCHEDULE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-900" />
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Upcoming Live Sessions Timetable
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {filteredUpcoming.length} scheduled sessions
          </span>
        </div>

        {filteredUpcoming.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No upcoming sessions for {selectedClassFilter}. Check back soon or view recorded lectures below.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredUpcoming.map((item) => {
              const hasReminder = reminders.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {item.classLevel} · {item.subject}
                      </span>
                      <div className="flex items-center gap-1.5 text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.date} at {item.time}</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
                      <span className="font-semibold text-slate-800">Faculty:</span>
                      <span>{item.teacherName} ({item.teacherRole})</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                    <button
                      onClick={() => onToggleReminder(item.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        hasReminder
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{hasReminder ? 'Reminder Set' : 'Remind Me'}</span>
                    </button>

                    <button
                      onClick={() => onOpenPlayer(item)}
                      className="px-4 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      Preview Stream
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* RECENTLY COMPLETED LIVE RECORDINGS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-700" />
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Recently Completed Recordings & Class Archives
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {filteredCompleted.length} recorded lectures
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompleted.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-black overflow-hidden group">
                  <img
                    src={TEACHER_STUDIO_IMAGE}
                    alt={rec.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                    {rec.durationMinutes} mins
                  </span>

                  <button
                    onClick={() => onOpenPlayer(rec)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    aria-label="Play recording"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5 text-slate-950" />
                    </div>
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-blue-700">{rec.classLevel}</span>
                    <span>{rec.viewersCount.toLocaleString('en-IN')} views</span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-slate-900 line-clamp-2">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {rec.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => handleDownload(rec, 'notes')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Notes</span>
                </button>

                <button
                  onClick={() => onOpenPlayer(rec)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Watch Video
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Connection Callout */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          <span className="font-semibold text-slate-900">Are you an administrator?</span>{' '}
          Connect your official YouTube Data API and Channel ID (@UPBoard_Coaching) in Admin Settings to stream directly to students.
        </div>
        <button
          onClick={onNavigateToAdmin}
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold shrink-0 cursor-pointer"
        >
          Open Admin Settings &rarr;
        </button>
      </div>

    </div>
  );
};
