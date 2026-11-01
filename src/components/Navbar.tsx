/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  FileText,
  Bell,
  User,
  Menu,
  X,
  Moon,
  Sun,
  GraduationCap,
  Sparkles,
  Download,
  Calendar,
} from 'lucide-react';
import { PageView, StudentUser, StudentNotificationItem } from '../types';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  currentUser: StudentUser | null;
  notifications: StudentNotificationItem[];
  onOpenNotifications: () => void;
  isLiveActive: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  notifications,
  onOpenNotifications,
  isLiveActive,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classesDropdownOpen, setClassesDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setClassesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Notification Announcement Bar */}
      {isLiveActive && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white text-red-600 tracking-wider uppercase">
            LIVE NOW
          </span>
          <span className="truncate">
            Class 12 Physics Maha-Marathon: Complete Electrostatics in 1 Shot!
          </span>
          <button
            onClick={() => navigateTo('live-classes')}
            className="underline font-semibold ml-2 hover:text-amber-100 whitespace-nowrap cursor-pointer"
          >
            Watch Stream &rarr;
          </button>
        </div>
      )}

      {/* Main Sticky Navbar - Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single Wordmark Brand Zone with Official Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-20_at_18.13.43_64311f73.jpeg"
                alt="UP BOARD COACHING Emblem"
                className="w-11 h-11 object-contain rounded-full shadow-md group-hover:scale-105 transition-transform border border-amber-400"
              />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-blue-950 group-hover:text-blue-700 transition-colors whitespace-nowrap">
                  UP BOARD <span className="text-amber-500">COACHING</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase whitespace-nowrap -mt-0.5">
                  Your Success, Our Mission
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise Single-line Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-blue-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentPage === 'home' ? 'text-blue-700 font-semibold border-b-2 border-blue-700' : ''
              }`}
            >
              Home
            </button>

            {/* Classes Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setClassesDropdownOpen(!classesDropdownOpen)}
                className={`flex items-center gap-1 hover:text-blue-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                  currentPage.startsWith('class-') || currentPage === 'courses'
                    ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                    : ''
                }`}
              >
                <span>Courses & Classes</span>
                <span className="text-xs text-slate-400">▾</span>
              </button>

              <div className="absolute left-0 top-full pt-2 w-52 hidden group-hover:block hover:block z-50">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 text-xs space-y-1">
                  <button
                    onClick={() => navigateTo('courses')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 font-semibold text-blue-900 flex items-center justify-between cursor-pointer"
                  >
                    <span>All Classes (9 - 12)</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => navigateTo('class-12')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-700 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium">12 - senior secondary</span>
                    <span className="text-[10px] text-slate-400">Board Exam</span>
                  </button>
                  <button
                    onClick={() => navigateTo('class-11')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-700 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium">11 - pre senior secondary</span>
                    <span className="text-[10px] text-slate-400">Foundation</span>
                  </button>
                  <button
                    onClick={() => navigateTo('class-10')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-700 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium">10 - secondary</span>
                    <span className="text-[10px] text-slate-400">Board Exam</span>
                  </button>
                  <button
                    onClick={() => navigateTo('class-9')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-700 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium">9 - pre secondary</span>
                    <span className="text-[10px] text-slate-400">Basics</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('live-classes')}
              className={`flex items-center gap-1.5 hover:text-blue-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentPage === 'live-classes' ? 'text-blue-700 font-semibold border-b-2 border-blue-700' : ''
              }`}
            >
              <Video className="w-4 h-4 text-red-600" />
              <span>Live Classes</span>
              {isLiveActive && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
              )}
            </button>

            {/* LIVE QUIZ 50 QUESTIONS TAB */}
            <button
              onClick={() => navigateTo('live-quiz')}
              className={`flex items-center gap-1.5 hover:text-blue-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentPage === 'live-quiz' ? 'text-blue-700 font-semibold border-b-2 border-blue-700' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Live Quiz</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                50 Qs
              </span>
            </button>

            <button
              onClick={() => navigateTo('study-material')}
              className={`hover:text-blue-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentPage === 'study-material' ? 'text-blue-700 font-semibold border-b-2 border-blue-700' : ''
              }`}
            >
              Notes & PPTs
            </button>

            <button
              onClick={() => navigateTo('previous-year-papers')}
              className={`hover:text-blue-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentPage === 'previous-year-papers' ? 'text-blue-700 font-semibold border-b-2 border-blue-700' : ''
              }`}
            >
              Question Papers
            </button>

            <button
              onClick={() => navigateTo('notifications')}
              className={`hover:text-blue-700 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentPage === 'notifications' ? 'text-blue-700 font-semibold border-b-2 border-blue-700' : ''
              }`}
            >
              UPMSP Updates
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              title="Notifications"
              className="relative p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Student notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>



            {/* Dark Theme Toggle Button */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                className="p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle dark theme"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
            )}

            {/* Primary Action Button: Student Portal */}
            <button
              onClick={() => navigateTo('student-portal')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-sm shadow-blue-900/20 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser ? currentUser.fullName.split(' ')[0] : 'Student Portal'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => navigateTo('class-12')}
                className="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-xs font-semibold text-left cursor-pointer"
              >
                12 - senior secondary
              </button>
              <button
                onClick={() => navigateTo('class-10')}
                className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-semibold text-left cursor-pointer"
              >
                10 - secondary
              </button>
              <button
                onClick={() => navigateTo('class-11')}
                className="p-2.5 bg-purple-50 text-purple-900 rounded-lg text-xs font-semibold text-left cursor-pointer"
              >
                11 - pre senior secondary
              </button>
              <button
                onClick={() => navigateTo('class-9')}
                className="p-2.5 bg-amber-50 text-amber-900 rounded-lg text-xs font-semibold text-left cursor-pointer"
              >
                9 - pre secondary
              </button>
            </div>

            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-800 border-t border-slate-100 pt-3">
              <button
                onClick={() => navigateTo('home')}
                className="text-left py-2 px-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('live-classes')}
                className="text-left py-2 px-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-600" />
                  Live Classes
                </span>
                {isLiveActive && <span className="text-[10px] text-red-600 font-bold">LIVE</span>}
              </button>
              <button
                onClick={() => navigateTo('live-quiz')}
                className="text-left py-2 px-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Live Quiz Marathon
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                  50 Qs
                </span>
              </button>
              <button
                onClick={() => navigateTo('study-material')}
                className="text-left py-2 px-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600" />
                Notes, PPTs & Formulas
              </button>
              <button
                onClick={() => navigateTo('previous-year-papers')}
                className="text-left py-2 px-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                Previous Year Papers (PYQ)
              </button>
              <button
                onClick={() => navigateTo('notifications')}
                className="text-left py-2 px-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <Bell className="w-4 h-4 text-amber-600" />
                UPMSP Board Notifications
              </button>
              <button
                onClick={() => navigateTo('exam-calendar')}
                className="text-left py-2 px-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                Exam Timetable & Calendar
              </button>
              <button
                onClick={() => navigateTo('student-portal')}
                className="text-left py-2 px-2 rounded-lg bg-blue-900 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-400" />
                {currentUser ? `Dashboard (${currentUser.fullName.split(' ')[0]})` : 'Login / Register Student Portal'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
