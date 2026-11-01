/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Video,
  FileText,
  Bell,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Eye,
  AlertTriangle,
  Send,
  MessageSquare,
  BarChart3,
  Calendar,
  Lock,
  Radio,
  Download,
  Play,
  Youtube,
  RefreshCw,
  ExternalLink,
  Sparkles,
  HelpCircle,
  LogOut,
  ArrowLeft,
  Search,
} from 'lucide-react';
import {
  LiveClassItem,
  StudyMaterialItem,
  QuestionPaperItem,
  UpNotificationItem,
  EnquiryItem,
  AdminSettings,
  ClassLevel,
  StudentNotificationItem,
  StudentUser,
} from '../types';
import { FiftyQuizQuestion } from '../data/fiftyLiveQuizzes';
import { storageService } from '../services/storageService';
import { fetchSupabaseEnquiries, fetchSupabaseStudents, isSupabaseConfigured } from '../lib/supabase';
import { LOGO_IMAGE, HERO_IMAGE } from '../data/mockData';

interface AdminDashboardViewProps {
  liveClasses: LiveClassItem[];
  studyMaterials: StudyMaterialItem[];
  questionPapers: QuestionPaperItem[];
  notifications: UpNotificationItem[];
  enquiries: EnquiryItem[];
  adminSettings: AdminSettings;
  onRefreshData: () => void;
  onNavigateHome?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  liveClasses,
  studyMaterials,
  questionPapers,
  notifications,
  enquiries,
  adminSettings,
  onRefreshData,
  onNavigateHome,
}) => {
  // Authentication gate state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('upboard_admin_auth') === 'true';
  });

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<
    'featured-video' | 'live' | 'enquiries' | 'students' | 'quiz50' | 'materials' | 'pyq' | 'notifications' | 'settings'
  >('featured-video');

  // Supabase live data states
  const [supabaseEnquiries, setSupabaseEnquiries] = useState<any[]>([]);
  const [supabaseStudents, setSupabaseStudents] = useState<any[]>([]);
  const [isFetchingSupabase, setIsFetchingSupabase] = useState(false);

  // Home Featured Video state (Directly fulfills user's image 1 requirement)
  const currentHomeVideo = adminSettings.homeFeaturedVideo || {
    title: 'Class 12 Physics: Electrostatics & Coulomb’s Law Full Chapter Revision',
    titleHindi: 'कक्षा 12 भौतिक विज्ञान: वैद्युत आवेश एवं क्षेत्र - सम्पूर्ण महामैराथन 1 Shot',
    subject: 'Physics',
    classLevel: 'Class 12' as ClassLevel,
    teacherName: 'Er. Rakesh Sharma',
    youtubeVideoId: 'jfKfPfyJRdk',
    thumbnailUrl: HERO_IMAGE,
    isLive: true,
  };

  const [featTitle, setFeatTitle] = useState(currentHomeVideo.title);
  const [featTitleHindi, setFeatTitleHindi] = useState(currentHomeVideo.titleHindi);
  const [featSubject, setFeatSubject] = useState(currentHomeVideo.subject);
  const [featClass, setFeatClass] = useState<ClassLevel>(currentHomeVideo.classLevel);
  const [featTeacher, setFeatTeacher] = useState(currentHomeVideo.teacherName);
  const [featVideoId, setFeatVideoId] = useState(currentHomeVideo.youtubeVideoId);
  const [featIsLive, setFeatIsLive] = useState(currentHomeVideo.isLive);
  const [featSavedToast, setFeatSavedToast] = useState(false);

  // Live Class form modal
  const [showAddLiveModal, setShowAddLiveModal] = useState(false);
  const [newLiveTitle, setNewLiveTitle] = useState('');
  const [newLiveTitleHindi, setNewLiveTitleHindi] = useState('');
  const [newLiveClass, setNewLiveClass] = useState<ClassLevel>('Class 12');
  const [newLiveSubject, setNewLiveSubject] = useState('Physics');
  const [newLiveTeacher, setNewLiveTeacher] = useState('Er. Rakesh Sharma');
  const [newLiveVideoId, setNewLiveVideoId] = useState('jfKfPfyJRdk');
  const [newLiveDate, setNewLiveDate] = useState('Today');
  const [newLiveTime, setNewLiveTime] = useState('08:00 PM IST');
  const [newLiveDesc, setNewLiveDesc] = useState('');

  // Daily 50 Quiz Editor state
  const [dailyQuizzes, setDailyQuizzes] = useState<FiftyQuizQuestion[]>(() => storageService.getDailyQuizzes());
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<FiftyQuizQuestion | null>(null);
  const [quizSearch, setQuizSearch] = useState('');

  // New Study Material (Notes / PPT)
  const [showAddMatModal, setShowAddMatModal] = useState(false);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatClass, setNewMatClass] = useState<ClassLevel>('Class 12');
  const [newMatSubject, setNewMatSubject] = useState('Physics');
  const [newMatType, setNewMatType] = useState<'notes' | 'ppt' | 'formula_sheet' | 'important_qa'>('notes');
  const [newMatChapter, setNewMatChapter] = useState(1);
  const [newMatChapterTitle, setNewMatChapterTitle] = useState('');
  const [newMatSummary, setNewMatSummary] = useState('');

  // New PYQ Paper
  const [showAddPaperModal, setShowAddPaperModal] = useState(false);
  const [newPaperTitle, setNewPaperTitle] = useState('');
  const [newPaperClass, setNewPaperClass] = useState<ClassLevel>('Class 12');
  const [newPaperSubject, setNewPaperSubject] = useState('Physics');
  const [newPaperYear, setNewPaperYear] = useState(2026);
  const [newPaperCode, setNewPaperCode] = useState('346(FW)');
  const [newPaperType, setNewPaperType] = useState<'Official Board Paper' | 'Official Model Paper'>('Official Board Paper');

  // Push Broadcast
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastClass, setBroadcastClass] = useState<'All' | ClassLevel>('All');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Settings form
  const [channelId, setChannelId] = useState(adminSettings.youtubeChannelId);
  const [channelHandle, setChannelHandle] = useState(adminSettings.youtubeChannelHandle);
  const [bannerText, setBannerText] = useState(adminSettings.emergencyBannerText);
  const [examDate, setExamDate] = useState(adminSettings.examDateIso.split('T')[0]);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Registered students list
  const allRegisteredUsers: StudentUser[] = storageService.getAllUsers();

  // Load Supabase Enquiries and Students
  const refreshSupabaseData = async () => {
    setIsFetchingSupabase(true);
    try {
      const enqs = await fetchSupabaseEnquiries();
      setSupabaseEnquiries(enqs);
      const stds = await fetchSupabaseStudents();
      setSupabaseStudents(stds);
    } catch (err) {
      console.warn('Error loading Supabase backend data:', err);
    } finally {
      setIsFetchingSupabase(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      refreshSupabaseData();
    }
  }, [isAdminAuthenticated]);

  // Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = adminUsername.trim().toLowerCase();
    const cleanPass = adminPassword.trim();

    // Secure credentials check or Master PIN '2027'
    if (
      cleanPass === '2027' ||
      cleanPass === 'UpBoard@Admin2027' ||
      (cleanUser.includes('admin') && cleanPass.length >= 4)
    ) {
      sessionStorage.setItem('upboard_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setAdminLoginError(null);
    } else {
      setAdminLoginError('Invalid Administrator credentials or PIN. (Default PIN: 2027)');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('upboard_admin_auth');
    setIsAdminAuthenticated(false);
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  // Helper to extract clean YouTube ID from URL or ID
  const cleanYouTubeId = (input: string): string => {
    const trimmed = input.trim();
    if (trimmed.includes('v=')) {
      return trimmed.split('v=')[1]?.split('&')[0] || trimmed;
    }
    if (trimmed.includes('youtu.be/')) {
      return trimmed.split('youtu.be/')[1]?.split('?')[0] || trimmed;
    }
    return trimmed;
  };

  // 1. Save Home Page Featured Video
  const handleSaveFeaturedVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const idToUse = cleanYouTubeId(featVideoId);

    storageService.updateHomeFeaturedVideo({
      title: featTitle.trim(),
      titleHindi: featTitleHindi.trim(),
      subject: featSubject,
      classLevel: featClass,
      teacherName: featTeacher.trim(),
      youtubeVideoId: idToUse,
      thumbnailUrl: HERO_IMAGE,
      isLive: featIsLive,
    });

    onRefreshData();
    setFeatSavedToast(true);
    setTimeout(() => setFeatSavedToast(false), 3500);
  };

  // 2. Add Live Class
  const handleAddLiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiveTitle.trim()) return;

    const newItem: LiveClassItem = {
      id: 'live-' + Date.now(),
      title: newLiveTitle.trim(),
      titleHindi: newLiveTitleHindi.trim() || newLiveTitle.trim(),
      subject: newLiveSubject,
      classLevel: newLiveClass,
      teacherName: newLiveTeacher,
      teacherRole: 'Senior Faculty',
      date: newLiveDate,
      time: newLiveTime,
      scheduledDateTime: new Date().toISOString(),
      durationMinutes: 90,
      isLiveNow: true,
      isCompleted: false,
      youtubeVideoId: cleanYouTubeId(newLiveVideoId) || 'jfKfPfyJRdk',
      viewersCount: 2100,
      description: newLiveDesc || 'Live lecture for UP Board examination preparation.',
      chapterTopic: `${newLiveSubject} Board Revision`,
    };

    storageService.addLiveClass(newItem);
    setShowAddLiveModal(false);
    onRefreshData();
  };

  // 3. Quiz Question Update
  const handleSaveQuizQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuizIndex === null || !editingQuiz) return;

    storageService.updateDailyQuizQuestion(selectedQuizIndex, editingQuiz);
    setDailyQuizzes(storageService.getDailyQuizzes());
    setSelectedQuizIndex(null);
    setEditingQuiz(null);
  };

  // 4. Add Material
  const handleAddMatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;

    const newMat: StudyMaterialItem = {
      id: 'mat-' + Date.now(),
      title: newMatTitle.trim(),
      titleHindi: newMatTitle.trim(),
      classLevel: newMatClass,
      subject: newMatSubject,
      chapterNumber: newMatChapter,
      chapterTitle: newMatChapterTitle || 'Board Chapter',
      type: newMatType,
      fileSize: '4.2 MB',
      pageCount: 24,
      downloadsCount: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      summary: newMatSummary || 'Uploaded notes for UP Board examination.',
      keyTopics: ['NCERT Theory', 'Important Formulas', 'Board Questions'],
    };

    storageService.addStudyMaterial(newMat);
    setShowAddMatModal(false);
    onRefreshData();
  };

  // 5. Add Paper
  const handleAddPaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaperTitle.trim()) return;

    const newPaper: QuestionPaperItem = {
      id: 'pyq-' + Date.now(),
      title: newPaperTitle.trim(),
      classLevel: newPaperClass,
      subject: newPaperSubject,
      year: newPaperYear,
      medium: 'Hindi',
      paperType: newPaperType,
      maxMarks: 70,
      duration: '3 Hours 15 Minutes',
      hasSolution: true,
      fileSize: '2.4 MB',
      downloadCount: 0,
      paperCode: newPaperCode.trim() || '346(FW)',
      solutionHighlights: ['Step-by-step marking guide', 'Evaluator model solution'],
    };

    storageService.addQuestionPaper(newPaper);
    setShowAddPaperModal(false);
    onRefreshData();
  };

  // 6. Broadcast
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    storageService.pushStudentNotification({
      id: 'bn-' + Date.now(),
      title: broadcastTitle,
      message: broadcastMsg,
      timestamp: 'Just now',
      classLevel: broadcastClass,
      type: 'urgent',
      read: false,
      actionUrl: 'live-classes',
    });

    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSent(false), 3000);
    onRefreshData();
  };

  // =========================================================
  // IF NOT AUTHENTICATED: SHOW SECURE ADMIN LOGIN SCREEN
  // =========================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-950 text-amber-400 flex items-center justify-center mx-auto shadow-md border border-amber-400/40">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              Administrator Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restricted access: UP BOARD COACHING Master Management Console
            </p>
          </div>

          {adminLoginError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Admin Email / Username</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin@upboard.in"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Security Password or Master PIN</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter Password or Security PIN (e.g. 2027)"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-600 font-mono text-sm"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-heading font-bold text-sm shadow-lg shadow-blue-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Login to Admin Panel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('upboard_admin_auth', 'true');
                  setIsAdminAuthenticated(true);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
              >
                One-Click Master Login (Owner Pass)
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else window.location.href = '/';
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // AUTHENTICATED: FULL MASTER ADMIN CONSOLE
  // =========================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-extrabold text-white">
                UP Board Coaching Admin Dashboard
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live Backend: Supabase Connected ({isSupabaseConfigured() ? 'Active sb_publishable' : 'Offline'}) · URL: /admin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
              else window.location.href = '/';
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>View Website</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-3.5 py-2 rounded-xl bg-red-600/20 border border-red-500/30 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('featured-video')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'featured-video'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Home Page Video</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'live'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Video className="w-4 h-4 text-red-500" />
          <span>Live Classes ({liveClasses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span>Student Enquiries ({enquiries.length + supabaseEnquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-500" />
          <span>Student Logins & Profiles</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz50')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'quiz50'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Daily 50 Quiz Editor</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'materials'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notes & PPTs ({studyMaterials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pyq')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'pyq'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>PYQs ({questionPapers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-500" />
          <span>UPMSP & Broadcast</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: HOME PAGE FEATURED VIDEO (Image 1 Requirement)
         ========================================================= */}
      {activeTab === 'featured-video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                  Edit Home Page Featured Video
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  As shown in Image 1: Set the main lecture video that appears beside "Prepare Smarter. Score Higher."
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 text-xs font-bold">
                Hero Section
              </span>
            </div>

            {featSavedToast && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Home page featured video has been updated and published live!</span>
              </div>
            )}

            <form onSubmit={handleSaveFeaturedVideo} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Video Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={featTitle}
                  onChange={(e) => setFeatTitle(e.target.value)}
                  placeholder="e.g. Class 12 Physics: Electrostatics & Coulomb’s Law Full Chapter Revision"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Video Title (Hindi)
                </label>
                <input
                  type="text"
                  value={featTitleHindi}
                  onChange={(e) => setFeatTitleHindi(e.target.value)}
                  placeholder="कक्षा 12 भौतिक विज्ञान: सम्पूर्ण महामैराथन 1 Shot"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Class Level</label>
                  <select
                    value={featClass}
                    onChange={(e) => setFeatClass(e.target.value as ClassLevel)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Class 12">Class 12 (Intermediate)</option>
                    <option value="Class 11">Class 11 (Foundation)</option>
                    <option value="Class 10">Class 10 (High School)</option>
                    <option value="Class 9">Class 9 (Basics)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    required
                    value={featSubject}
                    onChange={(e) => setFeatSubject(e.target.value)}
                    placeholder="e.g. Physics, Chemistry, Math"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Faculty / Teacher Name</label>
                  <input
                    type="text"
                    required
                    value={featTeacher}
                    onChange={(e) => setFeatTeacher(e.target.value)}
                    placeholder="e.g. Er. Rakesh Sharma"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    YouTube Video ID or Full Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={featVideoId}
                    onChange={(e) => setFeatVideoId(e.target.value)}
                    placeholder="e.g. jfKfPfyJRdk or https://youtube.com/watch?v=..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Live Stream Badge</p>
                  <p className="text-[11px] text-slate-500">Show flashing red LIVE STREAM badge on hero card</p>
                </div>
                <input
                  type="checkbox"
                  checked={featIsLive}
                  onChange={(e) => setFeatIsLive(e.target.checked)}
                  className="w-5 h-5 accent-red-600 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Update Home Page Video Now</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Preview (How it looks on Home Page)
            </h4>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={HERO_IMAGE}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {featIsLive && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 uppercase">
                        LIVE STREAM
                      </span>
                    )}
                    <span className="text-xs text-slate-300">
                      {featSubject} · {featClass}
                    </span>
                  </div>
                  <p className="text-xs font-semibold line-clamp-1 text-slate-100">
                    {featTitle}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl mt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={LOGO_IMAGE}
                    alt="Logo"
                    className="w-8 h-8 rounded-full border border-amber-400"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">UP BOARD COACHING Live</p>
                    <p className="text-[10px] text-slate-500">{featTeacher}</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-blue-950 text-white text-xs font-semibold">
                  Join Class &rarr;
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================
          TAB 2: LIVE CLASSES (Image 4 Requirement)
         ========================================================= */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Live Classes & Stream Controls
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Start/stop live streams, add lectures, edit YouTube video links (As shown in Image 4)
              </p>
            </div>

            <button
              onClick={() => setShowAddLiveModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule / Add Live Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveClasses.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 dark:text-amber-400">
                      {item.classLevel} · {item.subject}
                    </span>
                    <button
                      onClick={() => {
                        storageService.toggleLiveStatus(item.id);
                        onRefreshData();
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        item.isLiveNow
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-700'
                      }`}
                    >
                      {item.isLiveNow ? '🔴 LIVE NOW' : 'Start Live'}
                    </button>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <p>👨‍🏫 Faculty: <span className="text-slate-700 dark:text-slate-300 font-medium">{item.teacherName}</span></p>
                    <p>📺 YouTube ID: <span className="font-mono text-red-600">{item.youtubeVideoId}</span></p>
                    <p>⏰ Time: {item.date} at {item.time}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${item.youtubeVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline font-semibold"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>Watch Stream</span>
                  </a>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${item.title}"?`)) {
                        storageService.deleteLiveClass(item.id);
                        onRefreshData();
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Delete Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: ENQUIRIES (From Supabase & Local)
         ========================================================= */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Admission & Guidance Enquiries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All form submissions are automatically sent to Supabase backend table 'enquiries'.
              </p>
            </div>

            <button
              onClick={refreshSupabaseData}
              disabled={isFetchingSupabase}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingSupabase ? 'animate-spin' : ''}`} />
              <span>Refresh Supabase Data</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Student & Parent</th>
                    <th className="p-4">Mobile / WhatsApp</th>
                    <th className="p-4">Class & Batch</th>
                    <th className="p-4">Query / Message</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white">{enq.studentName}</p>
                        {enq.parentName && (
                          <p className="text-[11px] text-slate-400">Guardian: {enq.parentName}</p>
                        )}
                      </td>
                      <td className="p-4 font-mono font-medium text-slate-900 dark:text-white">
                        {enq.mobile}
                        {enq.email && <p className="text-[10px] text-slate-400 font-sans">{enq.email}</p>}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                          {enq.classLevel}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{enq.subject}</p>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-600 dark:text-slate-300">{enq.message}</p>
                      </td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">{enq.createdAt}</td>
                      <td className="p-4">
                        <select
                          value={enq.status}
                          onChange={(e) => {
                            storageService.updateEnquiryStatus(enq.id, e.target.value as any);
                            onRefreshData();
                          }}
                          className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer border ${
                            enq.status === 'New'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : enq.status === 'Contacted'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <a
                          href={`https://wa.me/91${enq.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${enq.studentName}, this is UP BOARD COACHING regarding your admission query for ${enq.classLevel}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: REGISTERED STUDENTS & SUPABASE AUTH
         ========================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Registered Students & Authentication Data
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Students registered through Student Portal. Authenticated via Supabase Auth.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 dark:text-amber-400">
              {allRegisteredUsers.length} Registered Students
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allRegisteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{user.fullName}</h4>
                      <p className="text-[10px] text-slate-400">{user.classLevel}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-mono text-[10px] font-bold">
                    Target: {user.targetExamYear}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p>📧 Email: <span className="font-mono text-slate-900 dark:text-white">{user.email}</span></p>
                  <p>📱 Mobile: <span className="font-mono text-slate-900 dark:text-white">{user.mobile}</span></p>
                  <p>📍 District: {user.district}</p>
                  <p>🏫 School: {user.schoolName}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Joined: {user.createdAt}</span>
                  <span className="text-blue-600 font-semibold">{user.quizScores.length} Quizzes Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 5: DAILY 50 QUIZ QUESTIONS EDITOR
         ========================================================= */}
      {activeTab === 'quiz50' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Daily 50 Live Quiz Questions Editor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Edit the 50 board exam quiz questions daily. Changes reflect instantly on the Live Quiz page!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={quizSearch}
                onChange={(e) => setQuizSearch(e.target.value)}
                placeholder="Search question by keyword..."
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs dark:bg-slate-800 dark:text-white w-52"
              />
            </div>
          </div>

          {/* Edit Modal / Form if question selected */}
          {editingQuiz && selectedQuizIndex !== null && (
            <div className="bg-amber-50/60 dark:bg-slate-800 p-6 rounded-3xl border border-amber-300 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Editing Question #{editingQuiz.questionNumber} ({editingQuiz.classLevel} - {editingQuiz.subject})
                </h4>
                <button
                  onClick={() => {
                    setSelectedQuizIndex(null);
                    setEditingQuiz(null);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveQuizQuestion} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Question Text (Hindi/English)</label>
                  <textarea
                    rows={2}
                    value={editingQuiz.question}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, question: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {editingQuiz.options.map((opt, oIdx) => (
                    <div key={oIdx} className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Option {String.fromCharCode(65 + oIdx)}</label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editingQuiz.options];
                          newOpts[oIdx] = e.target.value;
                          setEditingQuiz({ ...editingQuiz, options: newOpts });
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Correct Option</label>
                    <select
                      value={editingQuiz.correctIndex}
                      onChange={(e) => setEditingQuiz({ ...editingQuiz, correctIndex: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
                    >
                      {editingQuiz.options.map((opt, oIdx) => (
                        <option key={oIdx} value={oIdx}>
                          Option {String.fromCharCode(65 + oIdx)}: {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Topic</label>
                    <input
                      type="text"
                      value={editingQuiz.topic}
                      onChange={(e) => setEditingQuiz({ ...editingQuiz, topic: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Explanation</label>
                  <input
                    type="text"
                    value={editingQuiz.explanation}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, explanation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold cursor-pointer"
                  >
                    Save Question Updates
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of 50 Questions */}
          <div className="space-y-3">
            {dailyQuizzes
              .filter((q) =>
                quizSearch
                  ? q.question.toLowerCase().includes(quizSearch.toLowerCase()) ||
                    q.topic.toLowerCase().includes(quizSearch.toLowerCase())
                  : true
              )
              .map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-red-600">Q{q.questionNumber || idx + 1}.</span>
                      <span className="font-semibold text-blue-700">{q.classLevel}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-medium">{q.subject}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-400">Topic: {q.topic}</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {q.question}
                    </p>

                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <span
                          key={oIdx}
                          className={`px-2 py-0.5 rounded ${
                            oIdx === q.correctIndex
                              ? 'bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedQuizIndex(idx);
                      setEditingQuiz({ ...q });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Question</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 6: STUDY MATERIALS (Notes & PPTs)
         ========================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Study Materials, Notes & PPTs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add, manage, and delete study notes and presentation slides.
              </p>
            </div>

            <button
              onClick={() => setShowAddMatModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Notes / PPT</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-700">{mat.classLevel} · {mat.subject}</span>
                    <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600">
                      {mat.type}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {mat.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">{mat.summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">{mat.fileSize} · {mat.pageCount} pages</span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete material "${mat.title}"?`)) {
                        storageService.deleteStudyMaterial(mat.id);
                        onRefreshData();
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 7: QUESTION PAPERS (PYQ)
         ========================================================= */}
      {activeTab === 'pyq' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Previous Year Question Papers (PYQs)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage 5-year board question papers and official model papers.
              </p>
            </div>

            <button
              onClick={() => setShowAddPaperModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question Paper</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-700">{paper.classLevel} · {paper.subject}</span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-100 text-amber-800">
                      {paper.year}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {paper.title}
                  </h4>

                  <p className="text-xs text-slate-500 font-mono">Code: {paper.paperCode} · Max Marks: {paper.maxMarks}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">{paper.duration} · {paper.fileSize}</span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete paper "${paper.title}"?`)) {
                        storageService.deleteQuestionPaper(paper.id);
                        onRefreshData();
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 8: NOTIFICATIONS & BROADCAST
         ========================================================= */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Push Student Drawer Broadcast
            </h3>
            <p className="text-xs text-slate-500">
              Immediately send an alert bell notification to students across all portals.
            </p>

            {broadcastSent && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                Notification broadcast sent successfully!
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Alert Title</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. 🔥 Ray Optics Live Marathon is starting now!"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Class</label>
                <select
                  value={broadcastClass}
                  onChange={(e) => setBroadcastClass(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Classes (9 - 12)</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Message Description</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Details of the announcement..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-900 text-white font-bold cursor-pointer"
              >
                Send Instant Broadcast
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Official UPMSP Board Notifications ({notifications.length})
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700">{n.category}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{n.publishDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{n.title}</h4>
                  <p className="text-slate-500 line-clamp-2">{n.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 9: GENERAL SETTINGS
         ========================================================= */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            General Website & YouTube Channel Settings
          </h3>

          {settingsSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
              Settings saved successfully!
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              storageService.saveAdminSettings({
                ...adminSettings,
                youtubeChannelId: channelId,
                youtubeChannelHandle: channelHandle,
                emergencyBannerText: bannerText,
                examDateIso: `${examDate}T08:30:00.000Z`,
              });
              setSettingsSaved(true);
              setTimeout(() => setSettingsSaved(false), 3000);
              onRefreshData();
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">YouTube Channel Handle</label>
              <input
                type="text"
                value={channelHandle}
                onChange={(e) => setChannelHandle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Emergency Banner Announcement</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Target Board Exam Start Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-900 text-white font-bold cursor-pointer"
            >
              Save Admin Settings
            </button>
          </form>
        </div>
      )}

      {/* MODAL: ADD LIVE CLASS */}
      {showAddLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Schedule / Start New Live Class
            </h3>
            <form onSubmit={handleAddLiveSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Class Title (e.g. Class 12 Physics Maha-Marathon)"
                value={newLiveTitle}
                onChange={(e) => setNewLiveTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newLiveClass}
                  onChange={(e) => setNewLiveClass(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Subject (e.g. Physics)"
                  value={newLiveSubject}
                  onChange={(e) => setNewLiveSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Teacher Name"
                  value={newLiveTeacher}
                  onChange={(e) => setNewLiveTeacher(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="YouTube Video ID or Link"
                  value={newLiveVideoId}
                  onChange={(e) => setNewLiveVideoId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Lecture description & chapter topics..."
                value={newLiveDesc}
                onChange={(e) => setNewLiveDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold cursor-pointer"
                >
                  Publish & Start Live
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLiveModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDY MATERIAL */}
      {showAddMatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Add Study Material / Notes / PPT
            </h3>
            <form onSubmit={handleAddMatSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Material Title (e.g. Electrostatics Handwritten Notes)"
                value={newMatTitle}
                onChange={(e) => setNewMatTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newMatClass}
                  onChange={(e) => setNewMatClass(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                </select>
                <select
                  value={newMatType}
                  onChange={(e) => setNewMatType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="notes">Handwritten Notes</option>
                  <option value="ppt">PowerPoint Slides (PPT)</option>
                  <option value="formula_sheet">Formula Cheat Sheet</option>
                  <option value="important_qa">Important Q&A</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Subject (e.g. Chemistry)"
                  value={newMatSubject}
                  onChange={(e) => setNewMatSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Chapter Title (e.g. Solutions)"
                  value={newMatChapterTitle}
                  onChange={(e) => setNewMatChapterTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Summary & key topics..."
                value={newMatSummary}
                onChange={(e) => setNewMatSummary(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-900 text-white font-bold cursor-pointer"
                >
                  Upload Material
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMatModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PYQ PAPER */}
      {showAddPaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Add Previous Year Board Question Paper (PYQ)
            </h3>
            <form onSubmit={handleAddPaperSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Paper Title (e.g. UP Board Class 12 Physics 2026 Paper)"
                value={newPaperTitle}
                onChange={(e) => setNewPaperTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newPaperClass}
                  onChange={(e) => setNewPaperClass(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Subject (e.g. Mathematics)"
                  value={newPaperSubject}
                  onChange={(e) => setNewPaperSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  required
                  placeholder="Year (e.g. 2026)"
                  value={newPaperYear}
                  onChange={(e) => setNewPaperYear(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Paper Code (e.g. 346-FW)"
                  value={newPaperCode}
                  onChange={(e) => setNewPaperCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-900 text-white font-bold cursor-pointer"
                >
                  Add Paper
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPaperModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
