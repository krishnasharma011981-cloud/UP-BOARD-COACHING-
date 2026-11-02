/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView, StudentUser, LiveClassItem, PracticeQuiz, ClassLevel } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LivePlayerModal } from './components/LivePlayerModal';
import { MockTestModal } from './components/MockTestModal';
import { EnquiryModal } from './components/EnquiryModal';
import { StudentNotificationDrawer } from './components/StudentNotificationDrawer';

// Views
import { HomeView } from './views/HomeView';
import { LiveClassesView } from './views/LiveClassesView';
import { ClassDetailView } from './views/ClassDetailView';
import { CoursesView } from './views/CoursesView';
import { StudyMaterialView } from './views/StudyMaterialView';
import { QuestionPapersView } from './views/QuestionPapersView';
import { NotificationsView } from './views/NotificationsView';
import { ExamCalendarView } from './views/ExamCalendarView';
import { StudentPortalView } from './views/StudentPortalView';
import { LiveQuizView } from './views/LiveQuizView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AboutView, ContactView, FaqView, PrivacyView, TermsView } from './views/SupportViews';
import { NotFoundView } from './views/NotFoundView';
import { upmspService } from './services/upmspService';

// Primary URL routes mapping
const ROUTE_PATH_MAP: Record<PageView, string> = {
  home: '/',
  courses: '/courses',
  'class-12': '/class-12',
  'class-11': '/class-11',
  'class-10': '/class-10',
  'class-9': '/class-9',
  'live-classes': '/live-classes',
  'live-quiz': '/live-quiz',
  'study-material': '/study-material',
  'previous-year-papers': '/previous-year-papers',
  notifications: '/notifications',
  'exam-calendar': '/exam-calendar',
  'student-portal': '/student-portal',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
  admin: '/admin',
  'not-found': '/not-found',
};

// Public redirects & alias routes mapping
const PUBLIC_REDIRECTS: Record<string, PageView> = {
  '/quiz': 'live-quiz',
  '/test': 'live-quiz',
  '/50-quiz': 'live-quiz',
  '/omr': 'live-quiz',
  '/notes': 'study-material',
  '/materials': 'study-material',
  '/ppt': 'study-material',
  '/pyq': 'previous-year-papers',
  '/papers': 'previous-year-papers',
  '/model-papers': 'previous-year-papers',
  '/login': 'student-portal',
  '/register': 'student-portal',
  '/portal': 'student-portal',
  '/profile': 'student-portal',
  '/updates': 'notifications',
  '/circulars': 'notifications',
  '/upmsp': 'notifications',
  '/calendar': 'exam-calendar',
  '/timetable': 'exam-calendar',
  '/datesheet': 'exam-calendar',
  '/classes': 'courses',
  '/12': 'class-12',
  '/senior-secondary': 'class-12',
  '/11': 'class-11',
  '/pre-senior-secondary': 'class-11',
  '/10': 'class-10',
  '/secondary': 'class-10',
  '/9': 'class-9',
  '/pre-secondary': 'class-9',
  '/about-us': 'about',
  '/contact-us': 'contact',
  '/help': 'contact',
  '/support': 'contact',
  '/faqs': 'faq',
  '/privacy-policy': 'privacy',
  '/terms-of-service': 'terms',
  '/202': 'not-found',
  '/404': 'not-found',
  '/not-found': 'not-found',
};

export function resolveCurrentRoute(): { page: PageView; canonicalPath: string } {
  if (typeof window === 'undefined') return { page: 'home', canonicalPath: '/' };

  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const rawHash = window.location.hash.toLowerCase().replace('#', '').replace(/\/+$/, '') || '';

  // Priority check: hash routing (e.g. #/admin or #admin) or pathname
  let target = rawPath;
  if (rawHash) {
    target = rawHash.startsWith('/') ? rawHash : `/${rawHash}`;
  }

  // 1. Direct match with primary routes
  for (const [page, path] of Object.entries(ROUTE_PATH_MAP)) {
    if (target === path) {
      return { page: page as PageView, canonicalPath: path };
    }
  }

  // 2. Match public redirects & aliases
  if (PUBLIC_REDIRECTS[target]) {
    const targetPage = PUBLIC_REDIRECTS[target];
    return { page: targetPage, canonicalPath: ROUTE_PATH_MAP[targetPage] };
  }

  // 3. Fallback: if root or empty
  if (target === '' || target === '/') {
    return { page: 'home', canonicalPath: '/' };
  }

  // 4. Otherwise unrecognized route -> 202 / 404 Not Found Page
  return { page: 'not-found', canonicalPath: target };
}

export default function App() {
  const initialRoute = resolveCurrentRoute();
  const [currentPage, setCurrentPage] = useState<PageView>(() => initialRoute.page);
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => storageService.getCurrentUser());

  // Dark Theme state with persistence (Default is false = clean white theme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('upboard_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('upboard_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('upboard_dark_mode', 'false');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Comprehensive URL and Public Redirect Router listener
  useEffect(() => {
    const handleLocationChange = () => {
      const { page, canonicalPath } = resolveCurrentRoute();
      setCurrentPage(page);

      // Public redirect URL canonicalization (e.g., if user accessed /quiz, update to /live-quiz)
      try {
        if (
          page !== 'not-found' &&
          window.location.pathname !== canonicalPath &&
          !window.location.hash
        ) {
          window.history.replaceState({ page }, '', canonicalPath);
        }
      } catch {
        // ignore in iframe
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Data states from storageService
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>(() => storageService.getLiveClasses());
  const [studyMaterials, setStudyMaterials] = useState(() => storageService.getStudyMaterials());
  const [questionPapers, setQuestionPapers] = useState(() => storageService.getQuestionPapers());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());

  // Auto-subscribe to real-time UPMSP updates from upmspService
  useEffect(() => {
    const unsubscribe = upmspService.subscribe((liveNotifs) => {
      setNotifications(liveNotifs);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const [studentNotifications, setStudentNotifications] = useState(() => storageService.getStudentNotifications());
  const [enquiries, setEnquiries] = useState(() => storageService.getEnquiries());
  const [adminSettings, setAdminSettings] = useState(() => storageService.getAdminSettings());
  const [reminders, setReminders] = useState<string[]>(() => storageService.getReminders());

  // Modals state
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClassItem | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<PracticeQuiz | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Sync refresh function after admin operations
  const refreshAllData = () => {
    setLiveClasses(storageService.getLiveClasses());
    setStudyMaterials(storageService.getStudyMaterials());
    setQuestionPapers(storageService.getQuestionPapers());
    setNotifications(storageService.getNotifications());
    setStudentNotifications(storageService.getStudentNotifications());
    setEnquiries(storageService.getEnquiries());
    setAdminSettings(storageService.getAdminSettings());
    setReminders(storageService.getReminders());
    setCurrentUser(storageService.getCurrentUser());
  };

  const handleToggleReminder = (classId: string) => {
    storageService.toggleReminder(classId);
    setReminders(storageService.getReminders());
  };

  const handleToggleBookmarkMaterial = (materialId: string) => {
    if (!currentUser) {
      setCurrentPage('student-portal');
      return;
    }
    storageService.toggleBookmarkMaterial(materialId);
    setCurrentUser(storageService.getCurrentUser());
  };

  const handleToggleBookmarkPaper = (paperId: string) => {
    if (!currentUser) {
      setCurrentPage('student-portal');
      return;
    }
    storageService.toggleBookmarkPaper(paperId);
    setCurrentUser(storageService.getCurrentUser());
  };

  const isLiveNowActive = liveClasses.some((c) => c.isLiveNow);

  // Navigation handler with URL sync
  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const canonical = ROUTE_PATH_MAP[page] || '/';
      if (window.location.pathname !== canonical && !window.location.hash) {
        window.history.pushState({ page }, '', canonical);
      }
    } catch {
      // ignore in restricted iframe
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 transition-colors">
      
      {/* 1. STICKY TOP NAVBAR */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        currentUser={currentUser}
        notifications={studentNotifications}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        isLiveActive={isLiveNowActive}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. MAIN BODY CONTENT */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={navigateTo}
            onOpenLiveClass={(item) => setSelectedLiveClass(item)}
            onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
            liveClasses={liveClasses}
            studyMaterials={studyMaterials}
            questionPapers={questionPapers}
            notifications={notifications}
            currentUser={currentUser}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            adminSettings={adminSettings}
          />
        )}

        {currentPage === 'live-classes' && (
          <LiveClassesView
            liveClasses={liveClasses}
            onOpenPlayer={(item) => setSelectedLiveClass(item)}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
          />
        )}

        {currentPage === 'live-quiz' && (
          <LiveQuizView
            onScoreSave={() => {
              setCurrentUser(storageService.getCurrentUser());
            }}
          />
        )}

        {currentPage === 'courses' && (
          <CoursesView
            onNavigate={navigateTo}
            onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
          />
        )}

        {currentPage === 'class-12' && (
          <ClassDetailView
            classLevel="Class 12"
            studyMaterials={studyMaterials}
            onOpenQuiz={(quiz) => setSelectedQuiz(quiz)}
            onOpenLiveLecture={(lec) => setSelectedLiveClass(lec)}
            liveClasses={liveClasses}
            savedMaterialIds={currentUser?.savedMaterialIds || []}
            onToggleBookmark={handleToggleBookmarkMaterial}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'class-11' && (
          <ClassDetailView
            classLevel="Class 11"
            studyMaterials={studyMaterials}
            onOpenQuiz={(quiz) => setSelectedQuiz(quiz)}
            onOpenLiveLecture={(lec) => setSelectedLiveClass(lec)}
            liveClasses={liveClasses}
            savedMaterialIds={currentUser?.savedMaterialIds || []}
            onToggleBookmark={handleToggleBookmarkMaterial}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'class-10' && (
          <ClassDetailView
            classLevel="Class 10"
            studyMaterials={studyMaterials}
            onOpenQuiz={(quiz) => setSelectedQuiz(quiz)}
            onOpenLiveLecture={(lec) => setSelectedLiveClass(lec)}
            liveClasses={liveClasses}
            savedMaterialIds={currentUser?.savedMaterialIds || []}
            onToggleBookmark={handleToggleBookmarkMaterial}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'class-9' && (
          <ClassDetailView
            classLevel="Class 9"
            studyMaterials={studyMaterials}
            onOpenQuiz={(quiz) => setSelectedQuiz(quiz)}
            onOpenLiveLecture={(lec) => setSelectedLiveClass(lec)}
            liveClasses={liveClasses}
            savedMaterialIds={currentUser?.savedMaterialIds || []}
            onToggleBookmark={handleToggleBookmarkMaterial}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'study-material' && (
          <StudyMaterialView
            materials={studyMaterials}
            savedMaterialIds={currentUser?.savedMaterialIds || []}
            onToggleBookmark={handleToggleBookmarkMaterial}
            currentUserFullName={currentUser?.fullName}
          />
        )}

        {currentPage === 'previous-year-papers' && (
          <QuestionPapersView
            papers={questionPapers}
            bookmarkedPaperIds={currentUser?.bookmarkedPaperIds || []}
            onToggleBookmark={handleToggleBookmarkPaper}
            currentUserFullName={currentUser?.fullName}
          />
        )}

        {currentPage === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            onNavigate={navigateTo}
            onRefreshData={refreshAllData}
          />
        )}

        {currentPage === 'exam-calendar' && (
          <ExamCalendarView onNavigate={navigateTo} />
        )}

        {currentPage === 'student-portal' && (
          <StudentPortalView
            currentUser={currentUser}
            onLogin={(user) => setCurrentUser(user)}
            onLogout={() => {
              storageService.setCurrentUser(null);
              setCurrentUser(null);
            }}
            studyMaterials={studyMaterials}
            questionPapers={questionPapers}
            onOpenQuiz={(quiz) => setSelectedQuiz(quiz)}
            onNavigate={navigateTo}
          />
        )}

        {/* ADMIN DASHBOARD VIEW: ONLY ACCESSED VIA /admin or #admin */}
        {currentPage === 'admin' && (
          <AdminDashboardView
            liveClasses={liveClasses}
            studyMaterials={studyMaterials}
            questionPapers={questionPapers}
            notifications={notifications}
            enquiries={enquiries}
            adminSettings={adminSettings}
            onRefreshData={refreshAllData}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'about' && (
          <AboutView
            onNavigate={navigateTo}
            onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactView onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />
        )}

        {currentPage === 'faq' && <FaqView />}

        {currentPage === 'privacy' && <PrivacyView />}

        {currentPage === 'terms' && <TermsView />}

        {currentPage === 'not-found' && (
          <NotFoundView
            onNavigate={navigateTo}
            attemptedPath={
              typeof window !== 'undefined'
                ? window.location.pathname + window.location.hash
                : ''
            }
          />
        )}
      </main>

      {/* 3. PROFESSIONAL FOOTER (No admin link) */}
      <Footer
        setCurrentPage={navigateTo}
        onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
      />

      {/* 4. FLOATING WHATSAPP SUPPORT BUTTON */}
      <FloatingWhatsApp />

      {/* 5. INTERACTIVE MODALS */}
      {selectedLiveClass && (
        <LivePlayerModal
          liveClass={selectedLiveClass}
          onClose={() => setSelectedLiveClass(null)}
        />
      )}

      {selectedQuiz && (
        <MockTestModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onQuizCompleted={() => {
            setCurrentUser(storageService.getCurrentUser());
          }}
        />
      )}

      {/* Student Admission & Doubt Enquiry Form Modal (Connected to Supabase) */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        defaultClass={currentUser?.classLevel || 'Class 12'}
      />

      {/* Student Notification Drawer */}
      <StudentNotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={studentNotifications}
        onRefresh={() => setStudentNotifications(storageService.getStudentNotifications())}
        onNavigate={navigateTo}
      />
    </div>
  );
}
