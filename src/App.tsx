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

export default function App() {
  // Check if URL directly targets /admin
  const initialIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path === '/admin/' || hash === '#admin' || hash === '#/admin';
  };

  const [currentPage, setCurrentPage] = useState<PageView>(() => (initialIsAdminRoute() ? 'admin' : 'home'));
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

  // URL listener for /admin and #admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path === '/admin/' || hash === '#admin' || hash === '#/admin') {
        setCurrentPage('admin');
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Data states from storageService
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>(() => storageService.getLiveClasses());
  const [studyMaterials, setStudyMaterials] = useState(() => storageService.getStudyMaterials());
  const [questionPapers, setQuestionPapers] = useState(() => storageService.getQuestionPapers());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
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
      if (page === 'admin') {
        window.history.pushState(null, '', '/admin');
      } else if (window.location.pathname === '/admin' || window.location.hash.includes('admin')) {
        window.history.pushState(null, '', '/');
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
