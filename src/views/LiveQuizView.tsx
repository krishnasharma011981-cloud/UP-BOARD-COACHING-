/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RefreshCw,
  Clock,
  Filter,
  Check,
  ArrowRight,
  ListOrdered,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { FIFTY_LIVE_QUIZZES, FiftyQuizQuestion, getClassFiftyQuizzes } from '../data/fiftyLiveQuizzes';
import { ClassLevel } from '../types';
import { storageService } from '../services/storageService';
import { LOGO_IMAGE } from '../data/mockData';
import { recordSupabaseQuizScore } from '../lib/supabase';

interface LiveQuizViewProps {
  onScoreSave?: (score: number, total: number) => void;
  lockedClassLevel?: ClassLevel;
}

export const LiveQuizView: React.FC<LiveQuizViewProps> = ({ onScoreSave, lockedClassLevel }) => {
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(lockedClassLevel || null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'physics' | 'chemistry' | 'math' | 'hindi'>('all');
  const [viewMode, setViewMode] = useState<'line-by-line' | 'single-focus'>('line-by-line');
  const [focusedQuestionIdx, setFocusedQuestionIdx] = useState(0);

  const activeClassQuizzes = selectedClass ? getClassFiftyQuizzes(selectedClass) : [];

  // Filter questions
  const filteredQuestions = activeClassQuizzes.filter((q) => {
    if (activeFilter === 'physics') return q.subject.includes('Physics') || q.subject.includes('भौतिक') || q.subject.includes('Science') || q.subject.includes('विज्ञान');
    if (activeFilter === 'chemistry') return q.subject.includes('Chemistry') || q.subject.includes('रसायन');
    if (activeFilter === 'math') return q.subject.includes('Math') || q.subject.includes('गणित');
    if (activeFilter === 'hindi') return q.subject.includes('Hindi') || q.subject.includes('हिंदी');
    return true;
  });

  // Calculate live score
  let correctCount = 0;
  let incorrectCount = 0;
  Object.entries(selectedAnswers).forEach(([qNumStr, ansIdx]) => {
    const qNum = parseInt(qNumStr, 10);
    const q = activeClassQuizzes.find((item) => item.questionNumber === qNum);
    if (q) {
      if (ansIdx === q.correctIndex) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    }
  });

  const totalAttempted = Object.keys(selectedAnswers).length;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleSelectClass = (cls: ClassLevel) => {
    setSelectedClass(cls);
    setSelectedAnswers({});
    setFocusedQuestionIdx(0);
    setActiveFilter('all');
  };

  const handleSelectOption = (questionNumber: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: optionIndex,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setFocusedQuestionIdx(0);
    setSaveSuccessMsg('सभी उत्तर रीसेट कर दिए गए हैं। आप फिर से शुरू कर सकते हैं।');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveToPortal = () => {
    const quizTitle = `${selectedClass || 'UP Board'} 50-MCQ Live Quiz Marathon`;
    storageService.recordQuizScore(
      `fifty-live-quiz-${(selectedClass || 'all').toLowerCase().replace(/\s+/g, '-')}`,
      quizTitle,
      correctCount,
      50
    );
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      recordSupabaseQuizScore(
        currentUser.id,
        quizTitle,
        correctCount,
        50
      );
    }
    if (onScoreSave) {
      onScoreSave(correctCount, 50);
    }
    setSaveSuccessMsg(`🎉 आपका स्कोर (${correctCount}/50) स्टूडेंट पोर्टल में सुरक्षित हो गया है!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  if (!selectedClass) {
    const classCards: { level: ClassLevel; badge: string; title: string; subtitle: string; color: string }[] = [
      { level: 'Class 12', badge: '12th', title: '12 - Senior Secondary', subtitle: 'Physics, Chemistry, Math, Biology & Hindi · 50 MCQs', color: 'bg-blue-100 text-blue-900' },
      { level: 'Class 11', badge: '11th', title: '11 - Pre Senior Secondary', subtitle: 'Mechanics, Organic Basics, Vectors & Grammar · 50 MCQs', color: 'bg-cyan-100 text-cyan-900' },
      { level: 'Class 10', badge: '10th', title: '10 - Secondary', subtitle: 'Science, Math, Social Science & Hindi · 50 MCQs', color: 'bg-emerald-100 text-emerald-900' },
      { level: 'Class 9', badge: '9th', title: '9 - Pre Secondary', subtitle: 'NCERT Science, Math & Hindi/English · 50 MCQs', color: 'bg-amber-100 text-amber-900' },
    ];

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            UP Board 50-Question Live Quiz
          </span>
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Select Your Class to Start 50-MCQ Quiz
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Apni class chunein — har class ke liye 50 mahatvapurna UP Board OMR MCQs aur instant explanation taiyar hain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classCards.map((c) => (
            <button
              key={c.level}
              onClick={() => handleSelectClass(c.level)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-xl transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center font-heading font-extrabold text-lg group-hover:scale-105 transition-transform`}>
                  {c.badge}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-700 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {c.subtitle}
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <span className="w-full py-2.5 px-4 rounded-xl bg-blue-950 group-hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors">
                  <span>Start 50-MCQ Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner with Brand Logo */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={LOGO_IMAGE}
              alt="UP BOARD COACHING Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full shadow-lg border-2 border-amber-400 bg-white/10 shrink-0"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE QUIZ SECTION
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                UP Board 50 Live Quiz Marathon
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                लाइन से 50 महत्वपूर्ण प्रश्न (Clickable Answers) — कक्षा 10 एवं 12 के विज्ञान, भौतिकी, रसायन, गणित, जीव विज्ञान और हिंदी के बोर्ड परीक्षा प्रश्न।
              </p>
            </div>
          </div>

          {/* Quick Score Capsule */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl shrink-0">
            <div className="text-center px-3 border-r border-white/15">
              <span className="text-[11px] text-slate-300 block">Attempted</span>
              <span className="text-xl sm:text-2xl font-heading font-extrabold text-white tabular-nums">
                {totalAttempted} / 50
              </span>
            </div>
            <div className="text-center px-3 border-r border-white/15">
              <span className="text-[11px] text-emerald-300 block">Correct</span>
              <span className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-400 tabular-nums">
                {correctCount}
              </span>
            </div>
            <div className="text-center px-2">
              <span className="text-[11px] text-amber-300 block">Accuracy</span>
              <span className="text-xl sm:text-2xl font-heading font-extrabold text-amber-400 tabular-nums">
                {accuracy}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-sm transition-all animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Control Bar: Filters, View Mode Switcher, and Reset */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> फ़िल्टर:
          </span>
          {[
            { id: 'all', label: 'All 50 Questions (सभी 50 प्रश्न)' },
            { id: 'class-12', label: 'Class 12' },
            { id: 'class-10', label: 'Class 10' },
            { id: 'physics', label: 'Physics' },
            { id: 'chemistry', label: 'Chemistry' },
            { id: 'math', label: 'Math' },
            { id: 'hindi', label: 'Hindi' },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeFilter === flt.id
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* View Switcher & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('line-by-line')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'line-by-line' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Line-by-Line (सभी 50)</span>
            </button>

            <button
              onClick={() => setViewMode('single-focus')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'single-focus' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1-by-1 Focus</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Reset All Answers"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {totalAttempted > 0 && (
            <button
              onClick={handleSaveToPortal}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Score
            </button>
          )}
        </div>
      </div>

      {/* 50 Question Palette Quick Jump (Collapsible / Sticky bar) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">50 Questions Palette (1 से 50 तक):</span>
          <span className="text-slate-400 text-[11px]">
            Green = Correct, Red = Incorrect, Gray = Unanswered
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
          {FIFTY_LIVE_QUIZZES.map((q, idx) => {
            const userAns = selectedAnswers[q.questionNumber];
            const isAnswered = userAns !== undefined;
            const isCorrect = isAnswered && userAns === q.correctIndex;

            return (
              <button
                key={q.questionNumber}
                onClick={() => {
                  if (viewMode === 'single-focus') {
                    setFocusedQuestionIdx(idx);
                  } else {
                    const el = document.getElementById(`quiz-question-${q.questionNumber}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  !isAnswered
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : isCorrect
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-red-600 text-white shadow-xs'
                }`}
                title={`Q${q.questionNumber}: ${isAnswered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not answered'}`}
              >
                {q.questionNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: LINE BY LINE (All 50 Questions rendered sequentially down the page) */}
      {viewMode === 'line-by-line' && (
        <div className="space-y-6">
          {filteredQuestions.map((q) => {
            const userAns = selectedAnswers[q.questionNumber];
            const hasAnswered = userAns !== undefined;
            const isCorrect = hasAnswered && userAns === q.correctIndex;

            return (
              <div
                key={q.questionNumber}
                id={`quiz-question-${q.questionNumber}`}
                className={`p-6 bg-white rounded-2xl border transition-all shadow-2xs ${
                  !hasAnswered
                    ? 'border-slate-200 hover:border-slate-300'
                    : isCorrect
                    ? 'border-emerald-300 bg-emerald-50/15'
                    : 'border-red-300 bg-red-50/15'
                }`}
              >
                {/* Header Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-950 text-amber-400 font-heading font-extrabold text-sm flex items-center justify-center shadow-xs">
                      #{q.questionNumber}
                    </span>
                    <span className="font-semibold text-xs text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {q.classLevel} · {q.subject}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      टॉपिक: {q.topic}
                    </span>
                  </div>

                  {hasAnswered && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>सही उत्तर (Correct)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>गलत उत्तर (Incorrect)</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <div className="space-y-1 mb-4">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-snug">
                    {q.question}
                  </h3>
                  {q.questionHindi && q.questionHindi !== q.question && (
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {q.questionHindi}
                    </p>
                  )}
                </div>

                {/* 4 Clickable Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAns === optIdx;
                    const isOptionCorrect = optIdx === q.correctIndex;

                    let btnStyle = 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-800';
                    let badgeStyle = 'bg-slate-200 text-slate-700';

                    if (hasAnswered) {
                      if (isSelected) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 font-semibold';
                          badgeStyle = 'bg-emerald-600 text-white';
                        } else {
                          btnStyle = 'border-red-500 bg-red-50 text-red-950 font-semibold';
                          badgeStyle = 'bg-red-600 text-white';
                        }
                      } else if (isOptionCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold';
                        badgeStyle = 'bg-emerald-600 text-white';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.questionNumber, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${badgeStyle}`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </div>

                        {hasAnswered && isOptionCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Explanation revealed upon clicking */}
                {hasAnswered && (
                  <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <HelpCircle className="w-4 h-4 text-blue-700" />
                      <span>व्याख्या (Explanation):</span>
                    </div>
                    <p className="leading-relaxed pl-5 text-slate-600">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: SINGLE FOCUS MODE */}
      {viewMode === 'single-focus' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
          {(() => {
            const q = filteredQuestions[focusedQuestionIdx] || filteredQuestions[0];
            if (!q) return null;
            const userAns = selectedAnswers[q.questionNumber];
            const hasAnswered = userAns !== undefined;
            const isCorrect = hasAnswered && userAns === q.correctIndex;

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-950 text-amber-400 font-bold">
                      Question #{q.questionNumber} of 50
                    </span>
                    <span className="font-semibold text-slate-600">
                      {q.classLevel} · {q.subject}
                    </span>
                  </div>

                  <span className="text-slate-400">
                    Index: {focusedQuestionIdx + 1} of {filteredQuestions.length}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                    {q.question}
                  </h3>
                  {q.questionHindi && q.questionHindi !== q.question && (
                    <p className="text-sm text-slate-500">
                      {q.questionHindi}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAns === optIdx;
                    const isOptionCorrect = optIdx === q.correctIndex;

                    let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                    let badgeStyle = 'bg-slate-100 text-slate-700';

                    if (hasAnswered) {
                      if (isSelected) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20';
                          badgeStyle = 'bg-emerald-600 text-white';
                        } else {
                          btnStyle = 'border-red-500 bg-red-50 text-red-950 font-semibold';
                          badgeStyle = 'bg-red-600 text-white';
                        }
                      } else if (isOptionCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold';
                        badgeStyle = 'bg-emerald-600 text-white';
                      } else {
                        btnStyle = 'border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.questionNumber, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-sm cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${badgeStyle}`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {hasAnswered && isOptionCorrect && (
                          <Check className="w-5 h-5 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">व्याख्या / Solution Details:</p>
                    <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                  </div>
                )}

                {/* Focus Navigation Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setFocusedQuestionIdx((prev) => Math.max(0, prev - 1))}
                    disabled={focusedQuestionIdx === 0}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    &larr; Previous Question
                  </button>

                  <div className="text-xs font-semibold text-slate-500">
                    {focusedQuestionIdx + 1} / {filteredQuestions.length}
                  </div>

                  <button
                    onClick={() => setFocusedQuestionIdx((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                    disabled={focusedQuestionIdx === filteredQuestions.length - 1}
                    className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Completion Banner */}
      {totalAttempted >= 50 && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 text-center space-y-3 shadow-xl">
          <Award className="w-12 h-12 text-amber-300 mx-auto" />
          <h3 className="font-heading font-extrabold text-2xl">
            शाबाश! आपने पूरे 50 प्रश्न हल कर लिए हैं।
          </h3>
          <p className="text-sm text-emerald-100 max-w-md mx-auto">
            आपका स्कोर: {correctCount} / 50 (सटीकता: {accuracy}%). यह स्कोर आपकी यूपी बोर्ड परीक्षा तैयारी को मजबूत करेगा।
          </p>
          <button
            onClick={handleSaveToPortal}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Save Certificate to Student Portal
          </button>
        </div>
      )}

    </div>
  );
};
