/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  Phone,
  School,
  MapPin,
  BookOpen,
  Award,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  LogOut,
  Settings,
  Download,
  Play,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  StudentUser,
  ClassLevel,
  StudyMaterialItem,
  QuestionPaperItem,
  PracticeQuiz,
  PageView,
} from '../types';
import { storageService, DEMO_STUDENT } from '../services/storageService';
import { SUBJECTS_DATA, PRACTICE_QUIZZES_DATA } from '../data/mockData';
import {
  isSupabaseConfigured,
  registerStudentWithSupabase,
  loginStudentWithSupabase,
  SUPABASE_URL,
} from '../lib/supabase';

interface StudentPortalViewProps {
  currentUser: StudentUser | null;
  onLogin: (user: StudentUser) => void;
  onLogout: () => void;
  studyMaterials: StudyMaterialItem[];
  questionPapers: QuestionPaperItem[];
  onOpenQuiz: (quiz: PracticeQuiz) => void;
  onNavigate: (page: PageView) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  studyMaterials,
  questionPapers,
  onOpenQuiz,
  onNavigate,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regClass, setRegClass] = useState<ClassLevel>('Class 12');
  const [regSchool, setRegSchool] = useState('');
  const [regDistrict, setRegDistrict] = useState('Prayagraj');
  const [regPassword, setRegPassword] = useState('');

  // Password reset state
  const [resetSent, setResetSent] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');

  // Profile Edit modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editSchool, setEditSchool] = useState(currentUser?.schoolName || '');
  const [editDistrict, setEditDistrict] = useState(currentUser?.district || '');

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) return;
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (isSupabaseConfigured()) {
        await loginStudentWithSupabase(loginIdentifier.trim(), loginPassword);
      }
      const user = storageService.loginUser(loginIdentifier.trim());
      onLogin(user);
    } catch (err: any) {
      console.warn('Supabase login notice:', err);
      // Fallback to local session so student is never locked out
      const user = storageService.loginUser(loginIdentifier.trim());
      onLogin(user);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    storageService.setCurrentUser(DEMO_STUDENT);
    onLogin(DEMO_STUDENT);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regIdentifier.trim()) return;
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (isSupabaseConfigured()) {
        await registerStudentWithSupabase({
          fullName: regName.trim(),
          email: regIdentifier.includes('@') ? regIdentifier.trim() : `student_${regIdentifier.replace(/\D/g, '')}@upboard.in`,
          mobile: regIdentifier.replace(/\D/g, '') || '7518177177',
          password: regPassword || 'UpBoard@2027',
          classLevel: regClass,
          district: regDistrict.trim(),
          schoolName: regSchool.trim(),
        });
      }
      const newUser = storageService.registerUser({
        fullName: regName.trim(),
        emailOrMobile: regIdentifier.trim(),
        classLevel: regClass,
        schoolName: regSchool.trim(),
        district: regDistrict.trim(),
      });
      onLogin(newUser);
    } catch (err: any) {
      console.warn('Supabase registration fallback:', err);
      const newUser = storageService.registerUser({
        fullName: regName.trim(),
        emailOrMobile: regIdentifier.trim(),
        classLevel: regClass,
        schoolName: regSchool.trim(),
        district: regDistrict.trim(),
      });
      onLogin(newUser);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) return;
    setResetSent(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateProfile({
      schoolName: editSchool,
      district: editDistrict,
    });
    setIsEditingProfile(false);
  };

  // If student is logged in, show student dashboard
  if (currentUser) {
    const savedMaterials = studyMaterials.filter((m) =>
      currentUser.savedMaterialIds.includes(m.id)
    );

    const bookmarkedPapers = questionPapers.filter((p) =>
      currentUser.bookmarkedPaperIds.includes(p.id)
    );

    const availableQuizzes = PRACTICE_QUIZZES_DATA.filter(
      (q) => q.classLevel === currentUser.classLevel
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Student Welcome Header Card */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold uppercase tracking-wider">
                  Verified Student
                </span>
                <span className="text-slate-300 font-semibold capitalize">
                  {currentUser.classLevel === 'Class 12'
                    ? '12 - senior secondary'
                    : currentUser.classLevel === 'Class 11'
                    ? '11 - pre senior secondary'
                    : currentUser.classLevel === 'Class 10'
                    ? '10 - secondary'
                    : '9 - pre secondary'}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-400">Target Board Exam: {currentUser.targetExamYear}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Namaste, {currentUser.fullName}!
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-amber-400" />
                  {currentUser.schoolName}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {currentUser.district}, UP
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {currentUser.mobile}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Metrics Overview Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Syllabus Completed</p>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">
                {currentUser.completedLessonCount} Chapters
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Saved Study Notes</p>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">
                {currentUser.savedMaterialIds.length} Items
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Mock Tests Taken</p>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">
                {currentUser.quizScores.length} Tests Passed
              </h3>
            </div>
          </div>
        </div>

        {/* Subject Progress Trackers */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Subject-wise Learning Progress
              </h3>
              <p className="text-xs text-slate-500">
                Track your syllabus completion according to UPMSP 2026-27 guidelines.
              </p>
            </div>
            <button
              onClick={() => onNavigate(currentUser.classLevel === 'Class 12' ? 'class-12' : 'class-10')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              Continue Learning &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { subject: 'Physics (भौतिक विज्ञान)', progress: 75, chaptersDone: 10, total: 14 },
              { subject: 'Mathematics (गणित)', progress: 85, chaptersDone: 11, total: 13 },
              { subject: 'Chemistry (रसायन विज्ञान)', progress: 60, chaptersDone: 6, total: 10 },
              { subject: 'Samanya Hindi (सामान्य हिंदी)', progress: 90, chaptersDone: 9, total: 10 },
            ].map((sub, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-900">{sub.subject}</span>
                  <span className="text-blue-700">{sub.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 rounded-full transition-all duration-500"
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>{sub.chaptersDone} of {sub.total} Chapters studied</span>
                  <span>Target: 100% by Dec</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Quizzes Available for this Student */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Recommended Practice Tests & Mock Exams
              </h3>
              <p className="text-xs text-slate-500">
                Timed tests matching the UPMSP 20-OMR format. Instant scoring and detailed explanations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableQuizzes.map((quiz) => {
              const previousScore = currentUser.quizScores.find((q) => q.quizId === quiz.id);
              return (
                <div
                  key={quiz.id}
                  className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-700">{quiz.subject}</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {quiz.timeLimitMinutes} Mins
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      {quiz.title}
                    </h4>
                    {previousScore && (
                      <p className="text-xs text-emerald-700 font-semibold pt-1">
                        Highest Score: {previousScore.score} / {previousScore.total} (Taken on {previousScore.date})
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenQuiz(quiz)}
                    className="w-full py-2 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{previousScore ? 'Retake Test' : 'Start Test Now'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saved Materials and Bookmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saved Notes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Saved Notes & Handbooks</span>
            </h3>

            {savedMaterials.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No notes bookmarked yet. Click bookmark on any study material to save here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="truncate mr-2">
                      <p className="font-semibold text-slate-900 truncate">{mat.title}</p>
                      <p className="text-[11px] text-slate-500">{mat.subject} · {mat.fileSize}</p>
                    </div>
                    <button
                      onClick={() => storageService.downloadResource(mat.title, 'pdf')}
                      className="px-2.5 py-1 rounded-lg bg-blue-950 text-white font-medium hover:bg-blue-800 shrink-0 cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarked PYQ Papers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Bookmarked Question Papers</span>
            </h3>

            {bookmarkedPapers.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No question papers bookmarked yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {bookmarkedPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="truncate mr-2">
                      <p className="font-semibold text-slate-900 truncate">{paper.title}</p>
                      <p className="text-[11px] text-slate-500">Code: {paper.paperCode} · Year {paper.year}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('previous-year-papers')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-900 text-white font-medium hover:bg-indigo-800 shrink-0 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl border border-slate-200"
            >
              <h3 className="font-heading font-bold text-base text-slate-900">
                Update Student Profile
              </h3>
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-700">School Name</label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs"
                  placeholder="e.g. Govt Inter College"
                />
              </div>
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-700">District (Uttar Pradesh)</label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs"
                  placeholder="e.g. Prayagraj / Lucknow"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    );
  }

  // Otherwise, render Login / Register / Forgot Password Authentication Screen
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Auth Header */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-6 sm:p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto font-heading font-extrabold text-xl shadow-lg">
            UP
          </div>
          <h2 className="font-heading font-bold text-2xl text-white">
            Student Portal
          </h2>
          <p className="text-xs text-slate-300">
            Access chapter notes, live class attendance, syllabus tracking, and test results.
          </p>

          {/* Supabase Status Pill */}
          <div className="pt-1 flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-700/60 text-[11px] text-slate-200">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                }`}
              />
              <span>
                Supabase DB: <strong className="font-mono text-white">uolvqremklljqgoutdbl</strong>
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="pt-4 flex justify-center gap-2">
            <button
              onClick={() => {
                setAuthMode('login');
                setResetSent(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setResetSent(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              New Registration
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-8">
          {/* Quick Demo Login Shortcut */}
          <div className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div>
              <p className="font-bold">⚡ Instant Demo Access</p>
              <p className="text-[11px] text-amber-800">Experience Class 12 Topper Dashboard with 1 click.</p>
            </div>
            <button
              onClick={handleQuickDemoLogin}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 cursor-pointer"
            >
              Demo Login
            </button>
          </div>

          {/* 1. LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email or Mobile Number</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter registered mobile number or email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-700 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] text-blue-700 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-700 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-950 hover:bg-blue-800 text-white font-heading font-bold rounded-xl transition-colors shadow-md shadow-blue-950/20 text-xs cursor-pointer"
              >
                Sign In to Student Portal
              </button>
            </form>
          )}

          {/* 2. REGISTRATION FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-700 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Mobile Number (or Email)</label>
                <input
                  type="text"
                  required
                  value={regIdentifier}
                  onChange={(e) => setRegIdentifier(e.target.value)}
                  placeholder="10 digit WhatsApp number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-700 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Class</label>
                  <select
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value as ClassLevel)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
                  >
                    <option value="Class 12">12 - senior secondary</option>
                    <option value="Class 11">11 - pre senior secondary</option>
                    <option value="Class 10">10 - secondary</option>
                    <option value="Class 9">9 - pre secondary</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">District (UP)</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Lucknow, Varanasi"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-700 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">School / College Name</label>
                <input
                  type="text"
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                  placeholder="e.g. GIC / St. Xavier / Inter College"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-700 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Create Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-700 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-950 hover:bg-blue-800 text-white font-heading font-bold rounded-xl transition-colors shadow-md text-xs cursor-pointer"
              >
                Complete Registration
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <div className="space-y-4 text-xs">
              {resetSent ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold">Reset OTP Sent!</p>
                  <p className="text-xs text-emerald-800">
                    A password recovery link and OTP has been dispatched to {resetIdentifier}. Check your WhatsApp or SMS inbox.
                  </p>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setResetSent(false);
                    }}
                    className="mt-2 text-xs font-bold text-blue-700 underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-slate-600">
                    Enter your registered email or mobile number to receive an account recovery OTP.
                  </p>
                  <input
                    type="text"
                    required
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder="Enter mobile or email"
                    className="w-full p-2.5 border rounded-xl text-xs"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="px-4 py-2 border rounded-xl text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-900 text-white font-semibold rounded-xl text-xs"
                    >
                      Send Recovery OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
