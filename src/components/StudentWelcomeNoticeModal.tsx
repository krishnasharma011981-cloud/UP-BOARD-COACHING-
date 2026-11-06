/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, X, ChevronLeft, ChevronRight, ExternalLink, Bell } from 'lucide-react';
import { PageView } from '../types';

interface StudentWelcomeNoticeModalProps {
  onNavigate: (page: PageView) => void;
  isLoggedIn: boolean;
}

export const StudentWelcomeNoticeModal: React.FC<StudentWelcomeNoticeModalProps> = ({
  onNavigate,
  isLoggedIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const notices = [
    {
      title: 'UP Board 2027 Student Portal & Exam Notice',
      description:
        'Theory exams and master target batches for Class 9, 10, 11 & 12 are active. Please login with your student account to access your complete syllabus, daily 50-MCQ live quizzes, topper notes & live doubt sessions.',
      buttonText: 'Student Login',
      targetPage: 'student-portal' as PageView,
    },
    {
      title: 'UP Board High School & Intermediate Date Sheet Released',
      description:
        'Official UPMSP timetable for Class 10 (Secondary) and Class 12 (Senior Secondary) examination has been updated. Check day-wise schedule and time slots.',
      buttonText: 'View Date Sheet',
      targetPage: 'exam-calendar' as PageView,
    },
  ];

  useEffect(() => {
    // If student is already logged in, do not disturb
    if (isLoggedIn) return;

    try {
      const alreadyShown = sessionStorage.getItem('upboard_welcome_notice_dismissed');
      if (!alreadyShown) {
        // Small delay so page loads cleanly before modal appears
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore storage access errors
    }
  }, [isLoggedIn]);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('upboard_welcome_notice_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleAction = (page: PageView) => {
    handleDismiss();
    onNavigate(page);
  };

  if (!isOpen) return null;

  const activeNotice = notices[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-[390px] rounded-3xl overflow-hidden shadow-2xl border border-amber-900/20 transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Header - Rich Amber/Brown Banner matching Reference Image 2 */}
        <div className="bg-[#a34b07] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-white leading-tight">
                Notice
              </h3>
              <p className="text-[11px] text-amber-100/90 font-medium">
                UP Board Coaching Notice
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Close notification"
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body - Cream/Ivory Background */}
        <div className="bg-[#fef9ee] px-6 pt-6 pb-5 space-y-4">
          <div className="space-y-2.5">
            <h4 className="font-heading font-extrabold text-lg text-slate-900 leading-snug">
              {activeNotice.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeNotice.description}
            </p>
          </div>

          {/* CTA Action Button */}
          <div className="pt-1">
            <button
              onClick={() => handleAction(activeNotice.targetPage)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a34b07] hover:bg-[#883d04] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>{activeNotice.buttonText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer - Carousel Controls & Hide Button */}
        <div className="bg-white px-5 py-3.5 border-t border-amber-100 flex flex-col items-center gap-2">
          {/* Slide Indicator & Nav */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : notices.length - 1))}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Previous notice"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {notices.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlide ? 'w-5 bg-[#a34b07]' : 'w-1.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev < notices.length - 1 ? prev + 1 : 0))}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Next notice"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hide notification link */}
          <button
            onClick={handleDismiss}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a34b07] hover:text-[#883d04] transition-colors cursor-pointer pt-0.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Hide notification</span>
          </button>
        </div>

      </div>
    </div>
  );
};
