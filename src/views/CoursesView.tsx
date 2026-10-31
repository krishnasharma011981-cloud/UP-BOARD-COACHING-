/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Video,
  FileText,
  Award,
} from 'lucide-react';
import { PageView, ClassLevel } from '../types';
import { SUBJECTS_DATA } from '../data/mockData';

interface CoursesViewProps {
  onNavigate: (page: PageView) => void;
  onOpenEnquiry: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ onNavigate, onOpenEnquiry }) => {
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel>('Class 12');

  const filteredSubjects = SUBJECTS_DATA.filter((s) => s.classLevel === selectedLevel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Complete Academic Programs
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          UP Board Academic Curriculum & Batches
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Structured, comprehensive online courses aligned with Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP) and latest NCERT guidelines.
        </p>

        {/* Level Switcher */}
        <div className="pt-4 flex items-center justify-center gap-2">
          {(['Class 12', 'Class 11', 'Class 10', 'Class 9'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === level
                  ? 'bg-blue-950 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Class Highlight Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-slate-900">
              {selectedLevel} Complete Board Syllabus Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Includes full video lectures, chapter notes, PPTs, model test papers and teacher mentorship.
            </p>
          </div>

          <button
            onClick={() => {
              if (selectedLevel === 'Class 12') onNavigate('class-12');
              else if (selectedLevel === 'Class 11') onNavigate('class-11');
              else if (selectedLevel === 'Class 10') onNavigate('class-10');
              else onNavigate('class-9');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>Enter {selectedLevel} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-3 bg-slate-50/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                  {sub.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {sub.totalChapters} Chapters
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {sub.name}
                </h3>
                <p className="text-xs text-blue-700 font-medium">
                  {sub.nameHindi}
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {sub.description}
              </p>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                <button
                  onClick={() => {
                    if (selectedLevel === 'Class 12') onNavigate('class-12');
                    else if (selectedLevel === 'Class 11') onNavigate('class-11');
                    else if (selectedLevel === 'Class 10') onNavigate('class-10');
                    else onNavigate('class-9');
                  }}
                  className="text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Chapters & Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">
            Daily Free YouTube Live Classes
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Live conceptual theory, derivation proofs, and previous year numerical problem sessions with senior teachers.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">
            Handwritten Topper Notes & PPTs
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Concise, color-coded summaries formatted for quick board exam revision and high answer-sheet presentation scores.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">
            20-OMR & 50-Descriptive Tests
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Authentic mock tests following the latest UPMSP exam blueprint with timer, instant scores, and model answers.
          </p>
        </div>
      </div>

    </div>
  );
};
