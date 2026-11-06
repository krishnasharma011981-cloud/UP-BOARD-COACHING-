/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Video,
  Download,
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Play,
  ArrowRight,
  Bell,
  MessageCircle,
  HelpCircle,
  Award,
  Users,
} from 'lucide-react';
import {
  PageView,
  LiveClassItem,
  StudyMaterialItem,
  QuestionPaperItem,
  UpNotificationItem,
  StudentUser,
  ClassLevel,
  AdminSettings,
} from '../types';
import {
  HERO_IMAGE,
  TEACHER_STUDIO_IMAGE,
  STUDY_NOTES_IMAGE,
  STUDENT_TESTIMONIALS,
  FAQ_ITEMS,
  LOGO_IMAGE,
} from '../data/mockData';
import { ExamCountdownWidget } from '../components/ExamCountdownWidget';
import { HomeSliderBanner } from '../components/HomeSliderBanner';
import { storageService } from '../services/storageService';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  onOpenLiveClass: (liveClass: LiveClassItem) => void;
  onOpenEnquiry: () => void;
  liveClasses: LiveClassItem[];
  studyMaterials: StudyMaterialItem[];
  questionPapers: QuestionPaperItem[];
  notifications: UpNotificationItem[];
  currentUser: StudentUser | null;
  reminders: string[];
  onToggleReminder: (id: string) => void;
  adminSettings?: AdminSettings;
  onOpenPdfViewer?: (doc: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenLiveClass,
  onOpenEnquiry,
  liveClasses,
  studyMaterials,
  questionPapers,
  notifications,
  currentUser,
  reminders,
  onToggleReminder,
  adminSettings,
  onOpenPdfViewer,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const activeLiveClass = liveClasses.find((c) => c.isLiveNow) || liveClasses[0];

  const featuredVideo = adminSettings?.homeFeaturedVideo || {
    title: activeLiveClass.title,
    titleHindi: activeLiveClass.titleHindi,
    subject: activeLiveClass.subject,
    classLevel: activeLiveClass.classLevel,
    teacherName: activeLiveClass.teacherName,
    youtubeVideoId: activeLiveClass.youtubeVideoId,
    thumbnailUrl: activeLiveClass.youtubeVideoId
      ? `https://img.youtube.com/vi/${activeLiveClass.youtubeVideoId}/hqdefault.jpg`
      : HERO_IMAGE,
    isLive: true,
  };

  const currentYtId = featuredVideo.youtubeVideoId || activeLiveClass.youtubeVideoId || 'jfKfPfyJRdk';
  const initialThumb =
    featuredVideo.thumbnailUrl &&
    !featuredVideo.thumbnailUrl.startsWith('/src/')
      ? featuredVideo.thumbnailUrl
      : `https://img.youtube.com/vi/${currentYtId}/hqdefault.jpg`;

  const [currentThumb, setCurrentThumb] = useState<string>(initialThumb);

  useEffect(() => {
    const id = featuredVideo.youtubeVideoId || activeLiveClass.youtubeVideoId || 'jfKfPfyJRdk';
    if (featuredVideo.thumbnailUrl && !featuredVideo.thumbnailUrl.startsWith('/src/')) {
      setCurrentThumb(featuredVideo.thumbnailUrl);
    } else {
      setCurrentThumb(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
    }
  }, [featuredVideo.youtubeVideoId, featuredVideo.thumbnailUrl, activeLiveClass.youtubeVideoId]);

  const handleOpenFeatured = () => {
    const itemToOpen: LiveClassItem = {
      ...activeLiveClass,
      title: featuredVideo.title,
      titleHindi: featuredVideo.titleHindi,
      subject: featuredVideo.subject,
      classLevel: featuredVideo.classLevel,
      teacherName: featuredVideo.teacherName,
      youtubeVideoId: featuredVideo.youtubeVideoId,
      isLiveNow: featuredVideo.isLive,
    };
    onOpenLiveClass(itemToOpen);
  };

  const handleDownload = (item: StudyMaterialItem) => {
    if (onOpenPdfViewer) {
      onOpenPdfViewer(item);
    } else {
      storageService.downloadResource(item.title, item.type === 'ppt' ? 'ppt' : 'pdf', {
        summary: item.summary,
        keyTopics: item.keyTopics,
        studentName: currentUser?.fullName,
      });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* TOP AUTO-SLIDING FEATURE BANNER */}
      <HomeSliderBanner
        slides={storageService.getHomeSliders()}
        onNavigate={onNavigate}
      />

      {/* COURSES & CLASSES QUICK-ACCESS PANEL (12th, 11th, 10th, 9th) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              page: 'class-12' as PageView,
              title: '12th - senior secondary',
              gradient: 'from-[#6366f1] to-[#4f46e5]',
              btnTextColor: 'text-[#4f46e5]',
            },
            {
              page: 'class-11' as PageView,
              title: '11th - pre senior secondary',
              gradient: 'from-[#38bdf8] to-[#2563eb]',
              btnTextColor: 'text-[#2563eb]',
            },
            {
              page: 'class-10' as PageView,
              title: '10th - secondary',
              gradient: 'from-[#14b8a6] to-[#0d9488]',
              btnTextColor: 'text-[#0d9488]',
            },
            {
              page: 'class-9' as PageView,
              title: '9th - pre secondary',
              gradient: 'from-[#f59e0b] to-[#d97706]',
              btnTextColor: 'text-[#d97706]',
            },
          ].map((item) => (
            <div
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`rounded-2xl bg-gradient-to-r ${item.gradient} p-5 text-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 group`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg leading-snug text-white">
                  {item.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(item.page);
                }}
                className={`w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 ${item.btnTextColor} font-bold text-xs sm:text-sm shadow-xs transition-transform group-hover:scale-[1.01] cursor-pointer text-center`}
              >
                Open Courses &amp; Classes
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-2 sm:pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Quiet Domain Kicker */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-900 bg-blue-100/60 px-3.5 py-1.5 rounded-full border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Dedicated to UP Board Class 9, 10, 11 & 12</span>
              </div>

              {/* Main Headline with Anti-Orphan constraint & Score Higher in Red */}
              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] max-w-2xl mx-auto lg:mx-0">
                <span className="text-slate-950 dark:text-white">Prepare Smarter.</span> <br />
                <span className="text-red-600 font-extrabold">
                  Score Higher.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Join India’s premier educational ecosystem for Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP).
                Experience daily free YouTube live lectures, topper-verified handwritten notes, chapter PPTs, and previous 5-year question papers with detailed step solutions.
              </p>

              {/* Prominent CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => onOpenLiveClass(activeLiveClass)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-sm transition-all shadow-lg shadow-amber-500/25 hover:scale-[1.02] cursor-pointer"
                >
                  <Video className="w-4 h-4 text-slate-950" />
                  <span>Watch Live Classes</span>
                </button>

                <button
                  onClick={() => onNavigate('live-quiz')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-sm transition-all shadow-lg shadow-red-600/25 hover:scale-[1.02] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Live Quiz (50 Qs)</span>
                </button>

                <button
                  onClick={() => onNavigate('student-portal')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-heading font-semibold text-sm transition-all shadow-lg shadow-blue-950/20 hover:scale-[1.02] cursor-pointer"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{currentUser ? 'My Portal' : 'Student Portal'}</span>
                </button>

                <button
                  onClick={() => onNavigate('study-material')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-700" />
                  <span>Download Notes & PPTs</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  100% Free NCERT Curriculum
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Bilingual Hindi & English Medium
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Updated 2027 UPMSP Pattern
                </span>
              </div>
            </div>

            {/* Right Media Spotlight Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Glow backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-amber-500 rounded-3xl opacity-20 blur-xl"></div>

                {/* Frameless Direct Clickable 16:9 Video */}
                <div
                  onClick={handleOpenFeatured}
                  className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-2xl cursor-pointer group"
                >
                  <img
                    src={currentThumb}
                    alt={featuredVideo.title}
                    referrerPolicy="no-referrer"
                    onError={() => {
                      if (currentThumb.includes('maxresdefault')) {
                        setCurrentThumb(`https://img.youtube.com/vi/${currentYtId}/hqdefault.jpg`);
                      } else if (currentThumb !== HERO_IMAGE) {
                        setCurrentThumb(HERO_IMAGE);
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Subtle bottom gradient for title readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-400/50 group-hover:scale-110 active:scale-95 transition-all">
                      <Play className="w-7 h-7 fill-slate-950 ml-1 text-slate-950" />
                    </div>
                  </div>

                  {/* Bottom Floating Title */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      {featuredVideo.isLive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 tracking-wider uppercase">
                          LIVE STREAM
                        </span>
                      )}
                      <span className="text-xs text-slate-200 font-medium">
                        {featuredVideo.subject} · {featuredVideo.classLevel}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold line-clamp-1 text-white">
                      {featuredVideo.title}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* 4-Metric Trust Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-center p-2 border-r border-slate-100 last:border-0">
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-blue-950 tabular-nums">
                45,000+
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Active UP Board Aspirants
              </p>
            </div>
            <div className="text-center p-2 border-r border-slate-100 last:border-0">
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-500 tabular-nums">
                98.4%
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Top State Merit Score
              </p>
            </div>
            <div className="text-center p-2 border-r border-slate-100 last:border-0">
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-blue-950 tabular-nums">
                450+
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Free YouTube Lectures
              </p>
            </div>
            <div className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600 tabular-nums">
                5 Years
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Solved Question Papers
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. UPCOMING EXAMINATION COUNTDOWN WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ExamCountdownWidget onNavigate={onNavigate} />
      </section>

      {/* 2.5. LIVE QUIZ 50 MARATHON SECTION (JISME LINE SE 50 QUIZ HO AUR CLICKABLE HO ANS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-amber-400/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Featured Live Quiz Section · 50 Questions</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                UP Board Live Quiz: लाइन से 50 प्रश्न हल करें!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                बोर्ड परीक्षा में 20 OMR बहुविकल्पीय प्रश्न (MCQ) पूरे 20 अंक दिलाते हैं। हमारी टीम ने तैयार किए हैं लाइन से पूरे 50 सबसे महत्वपूर्ण प्रश्न — तुरंत सही/गलत उत्तर देखने के लिए क्लिक करें!
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  लाइन से 50 प्रश्न (1 to 50)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Clickable Instant Answers & Explanations
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Class 10 & 12 Complete Syllabus
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('live-quiz')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Open 50 Live Quiz Marathon &rarr;</span>
                </button>
              </div>
            </div>

            {/* Quick Interactive Demo Card */}
            <div className="w-full lg:w-96 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-b border-white/10 pb-2">
                <span>Quiz Sample Preview (Q#1 of 50)</span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                  Clickable
                </span>
              </div>
              <p className="text-xs font-bold text-white">
                गोलीय दर्पण की वक्रता त्रिज्या 30 सेमी है। इसकी फोकस दूरी (f) होगी:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onNavigate('live-quiz')}
                  className="p-2.5 rounded-lg bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-semibold text-left cursor-pointer flex items-center justify-between"
                >
                  <span>A. 15 सेमी</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                </button>
                <button
                  onClick={() => onNavigate('live-quiz')}
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-left hover:bg-white/10 cursor-pointer"
                >
                  <span>B. 30 सेमी</span>
                </button>
                <button
                  onClick={() => onNavigate('live-quiz')}
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-left hover:bg-white/10 cursor-pointer"
                >
                  <span>C. 60 सेमी</span>
                </button>
                <button
                  onClick={() => onNavigate('live-quiz')}
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-left hover:bg-white/10 cursor-pointer"
                >
                  <span>D. 10 सेमी</span>
                </button>
              </div>
              <div className="pt-2 text-[11px] text-amber-300/90 text-center font-medium">
                Click any option to solve all 50 questions live!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLASS-WISE SELECTION CARDS (Class 9, 10, 11, 12) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Targeted Preparation
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              Select Your Class Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore subject-wise syllabus, handwritten topper notes, PPT presentations, and practice tests.
            </p>
          </div>

          <button
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <span>View All Courses & Syllabi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Class 12 Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-heading font-extrabold text-lg group-hover:scale-105 transition-transform">
                12th
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors capitalize">
                  12 - senior secondary
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Physics, Chemistry, Mathematics, Biology & Hindi
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  Complete Derivation & Formula Handbooks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  Practical Exam & Viva Voce Guides
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  5-Year PYQs with Step Marking Answers
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('class-12')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-950 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open 12 - senior secondary Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Class 11 Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-900 flex items-center justify-center font-heading font-extrabold text-lg group-hover:scale-105 transition-transform">
                11th
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-cyan-700 transition-colors capitalize">
                  11 - pre senior secondary
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kinematics, Organic Basics, Vectors & Grammar
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                  Solid Foundation for Class 12 Board
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                  Chapter PPT Slides & Mind Maps
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                  Annual Exam Model Test Papers
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('class-11')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open 11 - pre senior secondary Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Class 10 Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-heading font-extrabold text-lg group-hover:scale-105 transition-transform">
                10th
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors capitalize">
                  10 - secondary
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Math, Science, Social Science, Hindi & English
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  20 OMR MCQs Full Strategy & Practice
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Ray Diagrams & Reaction Mechanisms
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  50-Mark Descriptive Model Answers
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('class-10')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open 10 - secondary Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Class 9 Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-heading font-extrabold text-lg group-hover:scale-105 transition-transform">
                9th
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors capitalize">
                  9 - pre secondary
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mathematics, Science & Basic Hindi/English
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Conceptual NCERT Problem Solving
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Interactive Quizzes & Self-Tests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Pre-Board Orientation & Base Building
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('class-9')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open 9 - pre secondary Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE CLASSES & RECORDINGS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              YouTube Live Class Schedule
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              Learn Live with Master Teachers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Attend daily interactive sessions, ask doubts live, and get free accompanying notes & PPTs.
            </p>
          </div>

          <button
            onClick={() => onNavigate('live-classes')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <span>View Full Live Schedule</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveClasses.slice(0, 3).map((item) => {
            const hasReminder = reminders.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={TEACHER_STUDIO_IMAGE}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {item.isLiveNow ? (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold">
                        {item.date} · {item.time}
                      </span>
                    )}

                    <button
                      onClick={() => onOpenLiveClass(item)}
                      className="absolute inset-0 flex items-center justify-center group/btn cursor-pointer"
                      aria-label="Watch class"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-slate-950 ml-0.5 text-slate-950" />
                      </div>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-700">{item.classLevel}</span>
                      <span>·</span>
                      <span>{item.subject}</span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-slate-900 line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">
                    By {item.teacherName}
                  </span>

                  <div className="flex items-center gap-2">
                    {!item.isLiveNow && !item.isCompleted && (
                      <button
                        onClick={() => onToggleReminder(item.id)}
                        className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          hasReminder
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Set Reminder"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onOpenLiveClass(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      {item.isLiveNow ? 'Join Live' : 'Watch Stream'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. NOTES & STUDY MATERIAL SPOTLIGHT */}
      <section className="bg-slate-100/70 py-14 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Free Download Vault
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                Topper Notes, PPTs & Formula Sheets
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Clean, beautifully formatted PDFs prepared by state rankers and senior UPMSP evaluators.
              </p>
            </div>

            <button
              onClick={() => onNavigate('study-material')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              <span>Browse All 85+ Study Files</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {studyMaterials.slice(0, 4).map((mat) => (
              <div
                key={mat.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {mat.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {mat.fileSize}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {mat.classLevel} · {mat.subject}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5 line-clamp-2">
                      {mat.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {mat.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                  <span className="text-[11px] text-slate-400">
                    {mat.downloadsCount.toLocaleString('en-IN')} downloads
                  </span>

                  <button
                    onClick={() => handleDownload(mat)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PREVIOUS YEAR QUESTION PAPERS (PYQ) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Score 90%+ Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              Previous 5 Years Question Papers & Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Practice official board exam papers from 2022 to 2026 with detailed marking scheme solutions.
            </p>
          </div>

          <button
            onClick={() => onNavigate('previous-year-papers')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <span>Explore 50+ PYQ Sets</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {questionPapers.slice(0, 3).map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-400/50 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Year {paper.year}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Code: {paper.paperCode}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-base text-slate-900 leading-snug">
                  {paper.title}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">Class & Medium:</span>{' '}
                    {paper.classLevel} ({paper.medium} Medium)
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Duration:</span>{' '}
                    {paper.duration} (Max Marks: {paper.maxMarks})
                  </p>
                  <p className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Evaluator Solution Included
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    if (onOpenPdfViewer) {
                      onOpenPdfViewer({
                        title: paper.title,
                        classLevel: paper.classLevel,
                        subject: paper.subject,
                        type: 'pyq',
                        year: paper.year,
                        paperCode: paper.paperCode,
                        summary: `Official UPMSP ${paper.classLevel} ${paper.subject} Question Paper (${paper.year}) with step-by-step marking solution.`,
                        keyTopics: paper.solutionHighlights || ['All Questions & Step Solutions'],
                        sampleQuestions: [
                          { q: 'Section A: Multiple Choice Question (1 Mark each)', a: 'Detailed step-by-step marking scheme verified answers provided in this official UPMSP solution.', marks: 1 },
                          { q: 'Section B: Short Answer Questions (2-3 Marks)', a: 'Conceptual definitions with circuit diagrams / chemical formulas / geometrical proofs.', marks: 3 },
                          { q: 'Section C: Long Answer Derivations (5 Marks)', a: 'Comprehensive derivation with neat diagrams and final formula highlight.', marks: 5 },
                        ]
                      });
                    } else {
                      onNavigate('previous-year-papers');
                    }
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-950 hover:bg-blue-800 text-white font-semibold text-xs text-center transition-colors cursor-pointer"
                >
                  View Paper & Solution
                </button>
                <button
                  onClick={() => {
                    if (onOpenPdfViewer) {
                      onOpenPdfViewer({
                        title: paper.title,
                        classLevel: paper.classLevel,
                        subject: paper.subject,
                        type: 'pyq',
                        year: paper.year,
                        paperCode: paper.paperCode,
                        summary: `Official UPMSP ${paper.classLevel} ${paper.subject} Question Paper (${paper.year}) with step-by-step marking solution.`,
                        keyTopics: paper.solutionHighlights || ['All Questions & Step Solutions'],
                      });
                    } else {
                      storageService.downloadResource(paper.title, 'pdf', {
                        summary: `Official UPMSP ${paper.classLevel} ${paper.subject} Question Paper (${paper.year}) with answer key.`,
                        keyTopics: paper.solutionHighlights || ['All Questions & Solutions'],
                      });
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Open & Download Paper PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LATEST UPMSP OFFICIAL NOTIFICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Official Bulletin
            </span>
            <h2 className="text-2xl font-heading font-bold text-slate-900">
              Latest UPMSP Announcements
            </h2>
          </div>
          <button
            onClick={() => onNavigate('notifications')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            All Notices &rarr;
          </button>
        </div>

        <div className="space-y-3">
          {notifications.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  {item.isUrgent && (
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px] uppercase">
                      Urgent
                    </span>
                  )}
                  <span className="font-semibold text-slate-700">{item.category}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-400">{item.publishDate}</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-1">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => onNavigate('notifications')}
                className="shrink-0 text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Read Official Circular</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 8. STUDENT TOPPERS & TESTIMONIALS */}
      <section className="bg-blue-950 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Proven Results
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              UP Board Toppers from UP BOARD COCHING
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Real students from across Uttar Pradesh districts who scored 95%+ marks with our lectures and notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDENT_TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">
                        {t.name}
                      </h4>
                      <p className="text-xs text-amber-400 font-semibold">{t.score}</p>
                      <p className="text-[11px] text-slate-400">{t.district}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  {t.class} Aspirant
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Clear Your Doubts
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about our free classes, notes, and UP Board examination rules.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-semibold text-sm text-slate-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-slate-400 shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. ENQUIRY CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-700/40">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              Free Guidance & Mentorship
            </span>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              Need Help Choosing Your Study Plan?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect with our senior UP Board faculty. We guide students on how to prepare timetable, write high-scoring answers, and manage exam stress.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenEnquiry}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs transition-colors shadow-lg shadow-amber-400/25 cursor-pointer"
            >
              Fill Enquiry Form
            </button>
            <a
              href="https://wa.me/917518177177?text=Hello%20UP%20BOARD%20COACHING,%20I%20need%20study%20guidance."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Mentor (7518177177)</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
