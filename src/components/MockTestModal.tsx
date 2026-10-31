/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RefreshCw,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { PracticeQuiz } from '../types';
import { storageService } from '../services/storageService';

interface MockTestModalProps {
  quiz: PracticeQuiz | null;
  onClose: () => void;
  onQuizCompleted?: (score: number, total: number) => void;
}

export const MockTestModal: React.FC<MockTestModalProps> = ({
  quiz,
  onClose,
  onQuizCompleted,
}) => {
  if (!quiz) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.timeLimitMinutes * 60);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    storageService.recordQuizScore(quiz.id, quiz.title, score, quiz.questions.length);
    if (onQuizCompleted) {
      onQuizCompleted(score, quiz.questions.length);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setSecondsRemaining(quiz.timeLimitMinutes * 60);
  };

  const currentQ = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <span>{quiz.classLevel}</span>
              <span>·</span>
              <span>{quiz.subject}</span>
              <span>·</span>
              <span>Mock Test</span>
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-white">
              {quiz.title}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-amber-300 font-mono text-xs font-bold tabular-nums">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isSubmitted ? (
          <div className="p-6 space-y-6">
            {/* Progress Bar & Question Counter */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span>
                {Object.keys(selectedAnswers).length} answered
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="space-y-3">
              <h4 className="text-base sm:text-lg font-heading font-semibold text-slate-900 leading-snug">
                {currentQ.question}
              </h4>
              {currentQ.questionHindi && (
                <p className="text-sm font-medium text-blue-900 bg-blue-50/70 p-3 rounded-lg border border-blue-100">
                  {currentQ.questionHindi}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous Question
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Submit Final Test
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results and Detailed Explanations */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Score Banner */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50 rounded-2xl border border-blue-100 space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Award className="w-8 h-8 text-amber-300" />
              </div>
              <h4 className="font-heading font-extrabold text-2xl text-slate-900">
                Your Score: {score} / {totalQuestions} ({percentage}%)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {percentage >= 80
                  ? '🌟 Outstanding! You are well prepared for the UP Board examination questions on this chapter.'
                  : percentage >= 50
                  ? '👍 Good attempt! Review the explanations below and revise key formulas.'
                  : '⚠️ Needs revision! Review handwritten topper notes and re-attempt this quiz.'}
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Test</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Done & Back to Portal
                </button>
              </div>
            </div>

            {/* Answer Explanations */}
            <div className="space-y-4">
              <h5 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
                Question-by-Question Review & Explanations:
              </h5>

              {quiz.questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/40 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900">
                        Q{idx + 1}. {q.question}
                      </span>
                      {isCorrect ? (
                        <span className="text-emerald-700 font-bold shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold shrink-0 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-800">Your Answer:</span>{' '}
                        {userAns !== undefined ? q.options[userAns] : 'Not Attempted'}
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-800 font-semibold">
                          Correct Answer: {q.options[q.correctIndex]}
                        </p>
                      )}
                    </div>

                    <div className="p-2.5 bg-white/80 rounded-lg border border-slate-200 text-slate-700">
                      <p className="font-semibold text-slate-900 mb-0.5">Teacher Explanation:</p>
                      <p>{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
