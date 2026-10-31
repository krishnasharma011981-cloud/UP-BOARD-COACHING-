/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Presentation,
  HelpCircle,
  Video,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Calculator,
  Atom,
  Zap,
  FlaskConical,
  HeartPulse,
  Compass,
  Bookmark,
  Share2,
} from 'lucide-react';
import {
  ClassLevel,
  SubjectItem,
  StudyMaterialItem,
  PracticeQuiz,
  LiveClassItem,
  PageView,
} from '../types';
import { SUBJECTS_DATA, PRACTICE_QUIZZES_DATA } from '../data/mockData';
import { storageService } from '../services/storageService';

interface ClassDetailViewProps {
  classLevel: ClassLevel;
  studyMaterials: StudyMaterialItem[];
  onOpenQuiz: (quiz: PracticeQuiz) => void;
  onOpenLiveLecture: (liveClass: LiveClassItem) => void;
  liveClasses: LiveClassItem[];
  savedMaterialIds: string[];
  onToggleBookmark: (materialId: string) => void;
  onNavigate: (page: PageView) => void;
}

export const ClassDetailView: React.FC<ClassDetailViewProps> = ({
  classLevel,
  studyMaterials,
  onOpenQuiz,
  onOpenLiveLecture,
  liveClasses,
  savedMaterialIds,
  onToggleBookmark,
  onNavigate,
}) => {
  const subjects = SUBJECTS_DATA.filter((s) => s.classLevel === classLevel);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'notes' | 'ppt' | 'qa' | 'quizzes' | 'schedule'>('notes');

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const classMaterials = studyMaterials.filter(
    (m) => m.classLevel === classLevel && (currentSubject ? m.subject.toLowerCase().includes(currentSubject.name.toLowerCase()) || currentSubject.name.toLowerCase().includes(m.subject.toLowerCase()) : true)
  );

  const classQuizzes = PRACTICE_QUIZZES_DATA.filter(
    (q) => q.classLevel === classLevel
  );

  const relatedLiveLectures = liveClasses.filter(
    (l) => l.classLevel === classLevel
  );

  const handleDownload = (material: StudyMaterialItem) => {
    storageService.downloadResource(material.title, material.type === 'ppt' ? 'ppt' : 'pdf', {
      summary: material.summary,
      keyTopics: material.keyTopics,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Header for Class */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            UPMSP Curriculum Hub
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            {classLevel} Complete Preparation Portal
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Everything you need to score 95%+ in {classLevel}: NCERT chapter notes, downloadable PPT slides, important questions & answers, embedded YouTube video lectures, and practice mock tests.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              {subjects.length} Major Subjects
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Chapter-wise Handwritten Notes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Official Board Pattern Question Banks
            </span>
          </div>
        </div>
      </div>

      {/* Subject Selector Bar */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Select Subject:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {subjects.map((subj) => {
            const isSelected = selectedSubjectId === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950 text-white border-blue-900 shadow-md shadow-blue-950/20'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {subj.code}
                  </span>
                  <h4 className="font-heading font-bold text-sm mt-2">
                    {subj.name}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {subj.nameHindi}
                  </p>
                </div>
                <div
                  className={`text-[11px] font-medium pt-2 border-t mt-3 ${
                    isSelected ? 'border-white/10 text-amber-300' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  {subj.totalChapters} Chapters
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Chapter Notes & PDFs</span>
        </button>

        <button
          onClick={() => setActiveTab('ppt')}
          className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ppt'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>PowerPoint Slides (PPT)</span>
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'qa'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Important Questions & Answers</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'quizzes'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Practice Quizzes & Mock Tests</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'schedule'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Subject Study Timetable</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. Chapter Notes & PDFs */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              {currentSubject?.name} Handwritten Notes & NCERT Theory
            </h3>
            <span className="text-xs text-slate-500">
              {classMaterials.length} materials available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classMaterials.map((mat) => {
              const isSaved = savedMaterialIds.includes(mat.id);
              return (
                <div
                  key={mat.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-700">
                        Chapter {mat.chapterNumber}: {mat.chapterTitle}
                      </span>
                      <button
                        onClick={() => onToggleBookmark(mat.id)}
                        className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                          isSaved ? 'text-amber-500' : 'text-slate-400'
                        }`}
                        title={isSaved ? 'Saved in Portal' : 'Bookmark in Student Portal'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <h4 className="font-heading font-bold text-base text-slate-900 leading-snug">
                      {mat.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mat.summary}
                    </p>

                    <div className="space-y-1 pt-1">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Key Topics Covered:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {mat.keyTopics.map((top, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]"
                          >
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                    <div className="text-[11px] text-slate-400 font-mono">
                      {mat.pageCount} Pages · {mat.fileSize}
                    </div>

                    <button
                      onClick={() => handleDownload(mat)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. PowerPoint Presentations (PPT) */}
      {activeTab === 'ppt' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Downloadable PowerPoint Presentations (PPT Slides)
            </h3>
            <span className="text-xs text-slate-500">
              Visual revision slide decks for students & teachers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classMaterials
              .filter((m) => m.type === 'ppt' || m.type === 'notes')
              .map((mat) => (
                <div
                  key={mat.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold uppercase">
                        PPT Presentation
                      </span>
                      <span className="text-slate-400 text-xs font-mono">
                        {mat.fileSize}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-slate-900">
                      {mat.title}
                    </h4>

                    <p className="text-xs text-slate-600">
                      High-impact visual slides with diagram breakdowns, bulleted formulas, and key points tailored for rapid screen revision.
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-500">
                      45+ HD Slides included
                    </span>

                    <button
                      onClick={() => handleDownload(mat)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Presentation className="w-3.5 h-3.5" />
                      <span>Download PPT Slide Deck</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. Important Questions & Answers */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Top Board Expected Questions with Step-by-Step Marking Answers
            </h3>
          </div>

          <div className="space-y-4">
            {classMaterials
              .flatMap((m) => m.sampleQuestions || [])
              .map((qa, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                      Q{idx + 1}. {qa.q}
                    </h4>
                    <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-900 font-bold text-xs shrink-0">
                      {qa.marks} Marks
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-900">Model Answer:</p>
                    <p className="leading-relaxed">{qa.a}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. Practice Quizzes & Mock Tests */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Interactive Chapter Tests & 20-OMR Practice
            </h3>
            <span className="text-xs text-slate-500">Instant scoring & explanations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-blue-700">{quiz.subject}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {quiz.timeLimitMinutes} Mins
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-slate-900">
                    {quiz.title}
                  </h4>

                  <p className="text-xs text-slate-600">
                    Test your understanding with {quiz.questions.length} board-level multiple choice questions.
                    Instant score certificate and teacher explanations provided.
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-emerald-600">
                    100% Free Practice
                  </span>

                  <button
                    onClick={() => onOpenQuiz(quiz)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <span>Start Test Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Subject Study Timetable */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Recommended Weekly Study Schedule for {classLevel} (Board Target: 95%+)
          </h3>
          <p className="text-xs text-slate-600">
            Follow this disciplined daily timetable curated by UP Board state toppers.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Subject Focus</th>
                  <th className="py-3 px-4">Daily Activity</th>
                  <th className="py-3 px-4">Recommended Resource</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">06:00 AM - 07:30 AM</td>
                  <td className="py-3 px-4 text-blue-700 font-semibold">Physics / Mathematics</td>
                  <td className="py-3 px-4 text-slate-600">Formula revision & Derivations practice</td>
                  <td className="py-3 px-4 text-slate-500">Handwritten Formula Handbook</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">04:30 PM - 06:00 PM</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Chemistry / Biology</td>
                  <td className="py-3 px-4 text-slate-600">Organic reactions, Diagrams & Life processes</td>
                  <td className="py-3 px-4 text-slate-500">Chapter PPT Slide deck</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">07:30 PM - 09:30 PM</td>
                  <td className="py-3 px-4 text-red-600 font-semibold">YouTube Live Class</td>
                  <td className="py-3 px-4 text-slate-600">Daily interactive lecture & live doubt solving</td>
                  <td className="py-3 px-4 text-slate-500">UP BOARD COCHING Live Stream</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">09:45 PM - 10:45 PM</td>
                  <td className="py-3 px-4 text-amber-700 font-semibold">Hindi & English Vyakaran</td>
                  <td className="py-3 px-4 text-slate-600">Rasa, Chhand, Alankar & Essay writing</td>
                  <td className="py-3 px-4 text-slate-500">Previous 5-Year Board Papers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Embedded Live Lectures Relevant to this Class */}
      {relatedLiveLectures.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-red-600" />
              <span>Recommended YouTube Lectures for {classLevel}</span>
            </h3>
            <button
              onClick={() => onNavigate('live-classes')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              All Lectures &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedLiveLectures.map((lec) => (
              <div
                key={lec.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase">
                    {lec.subject}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5 line-clamp-1">
                    {lec.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">By {lec.teacherName}</p>
                </div>

                <button
                  onClick={() => onOpenLiveLecture(lec)}
                  className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Watch Video
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
