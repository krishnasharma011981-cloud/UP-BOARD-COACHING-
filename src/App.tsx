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
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => storageService.getCurrentUser());

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

  // Scroll to top on page change
  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. STICKY TOP NAVBAR */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        currentUser={currentUser}
        notifications={studentNotifications}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        isLiveActive={isLiveNowActive}
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
          />
        )}

        {currentPage === 'live-classes' && (
          <LiveClassesView
            liveClasses={liveClasses}
            onOpenPlayer={(item) => setSelectedLiveClass(item)}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onNavigateToAdmin={() => navigateTo('admin')}
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

        {currentPage === 'admin' && (
          <AdminDashboardView
            liveClasses={liveClasses}
            studyMaterials={studyMaterials}
            questionPapers={questionPapers}
            notifications={notifications}
            enquiries={enquiries}
            adminSettings={adminSettings}
            onRefreshData={refreshAllData}
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

      {/* 3. PROFESSIONAL FOOTER */}
      <Footer
        setCurrentPage={navigateTo}
        onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
      />

      {/* 4. FLOATING WHATSAPP SUPPORT BUTTON */}
      <FloatingWhatsApp />

      {/* 5. INTERACTIVE MODALS */}
      {/* Live Player with Simulated Real-Time Chat & Material Downloads */}
      {selectedLiveClass && (
        <LivePlayerModal
          liveClass={selectedLiveClass}
          onClose={() => setSelectedLiveClass(null)}
        />
      )}

      {/* Interactive Mock Test / Quiz Runner with Timer & Explanations */}
      {selectedQuiz && (
        <MockTestModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onQuizCompleted={() => {
            setCurrentUser(storageService.getCurrentUser());
          }}
        />
      )}

      {/* Student Admission & Doubt Enquiry Form Modal */}
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
