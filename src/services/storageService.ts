/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StudentUser,
  LiveClassItem,
  StudyMaterialItem,
  QuestionPaperItem,
  UpNotificationItem,
  StudentNotificationItem,
  EnquiryItem,
  AdminSettings,
  ClassLevel,
  PracticeQuizQuestion,
  ChapterItem,
  SubjectItem,
} from '../types';
import {
  INITIAL_ADMIN_SETTINGS,
  LIVE_CLASSES_DATA,
  STUDY_MATERIALS_DATA,
  QUESTION_PAPERS_DATA,
  UPMSP_NOTIFICATIONS_DATA,
  INITIAL_NOTIFICATIONS,
  INITIAL_ENQUIRIES,
  SUBJECTS_DATA,
} from '../data/mockData';
import { ALL_CHAPTERS_DATA } from '../data/chaptersData';
import { FIFTY_LIVE_QUIZZES, FiftyQuizQuestion } from '../data/fiftyLiveQuizzes';
import { submitSupabaseEnquiry } from '../lib/supabase';

const STORAGE_KEYS = {
  CURRENT_USER: 'upboard_current_user',
  ALL_USERS: 'upboard_registered_users',
  LIVE_CLASSES: 'upboard_live_classes',
  STUDY_MATERIALS: 'upboard_study_materials',
  QUESTION_PAPERS: 'upboard_question_papers',
  UP_NOTIFICATIONS: 'upboard_notifications',
  STUDENT_NOTIFICATIONS: 'upboard_student_notifs',
  ENQUIRIES: 'upboard_enquiries',
  ADMIN_SETTINGS: 'upboard_admin_settings',
  REMINDERS: 'upboard_live_reminders',
  DAILY_QUIZZES: 'upboard_daily_quizzes_50',
  CHAPTERS: 'upboard_all_chapters',
  SUBJECTS: 'upboard_all_subjects',
};

// Default guest / demo student
export const DEMO_STUDENT: StudentUser = {
  id: 'std-demo-1',
  fullName: 'Aman Kumar Verma',
  email: 'aman.verma@example.com',
  mobile: '9876543210',
  classLevel: 'Class 12',
  targetExamYear: '2027',
  schoolName: 'Govt. Inter College (GIC), Prayagraj',
  district: 'Prayagraj',
  enrolledSubjects: ['12-PHY', '12-CHE', '12-MAT', '12-HIN'],
  savedMaterialIds: ['mat-01', 'mat-02'],
  bookmarkedPaperIds: ['pyq-12-phy-2026'],
  completedLessonCount: 14,
  quizScores: [
    {
      quizId: 'quiz-12-phy-01',
      quizTitle: 'Class 12 Physics: Electrostatics & Coulomb’s Law',
      score: 5,
      total: 5,
      date: '2026-10-28',
    },
  ],
  createdAt: '2026-09-01',
};

const DEFAULT_ADMIN_SETTINGS_WITH_VIDEO: AdminSettings = {
  ...INITIAL_ADMIN_SETTINGS,
  homeFeaturedVideo: {
    title: 'Class 12 Physics: Electrostatics & Coulomb’s Law Full Chapter Revision',
    titleHindi: 'कक्षा 12 भौतिक विज्ञान: वैद्युत आवेश एवं क्षेत्र - सम्पूर्ण महामैराथन 1 Shot',
    subject: 'Physics',
    classLevel: 'Class 12',
    teacherName: 'Er. Rakesh Sharma',
    youtubeVideoId: 'jfKfPfyJRdk',
    thumbnailUrl: '/src/assets/images/hero_upboard_students_1793429396730.jpg',
    isLive: true,
  },
};

class StorageService {
  private safeGet<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private safeSet<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage quota or access error', e);
    }
  }

  // --- Auth & User Profile ---
  getCurrentUser(): StudentUser | null {
    return this.safeGet<StudentUser | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: StudentUser | null): void {
    this.safeSet(STORAGE_KEYS.CURRENT_USER, user);
  }

  getAllUsers(): StudentUser[] {
    return this.safeGet<StudentUser[]>(STORAGE_KEYS.ALL_USERS, [DEMO_STUDENT]);
  }

  registerUser(details: {
    fullName: string;
    emailOrMobile: string;
    classLevel: ClassLevel;
    schoolName?: string;
    district?: string;
    password?: string;
  }): StudentUser {
    const isEmail = details.emailOrMobile.includes('@');
    const newUser: StudentUser = {
      id: 'std-' + Date.now(),
      fullName: details.fullName,
      email: isEmail ? details.emailOrMobile : `${details.emailOrMobile.replace(/\D/g, '')}@student.upboard.in`,
      mobile: isEmail ? '98XXXXXXXX' : details.emailOrMobile,
      classLevel: details.classLevel,
      targetExamYear: '2027',
      schoolName: details.schoolName || 'UPMSP Affiliated School',
      district: details.district || 'Uttar Pradesh',
      enrolledSubjects: details.classLevel === 'Class 12' 
        ? ['12-PHY', '12-CHE', '12-MAT', '12-HIN'] 
        : ['10-MAT', '10-SCI', '10-HIN', '10-ENG'],
      savedMaterialIds: ['mat-01'],
      bookmarkedPaperIds: [],
      completedLessonCount: 2,
      quizScores: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    const allUsers = this.safeGet<StudentUser[]>(STORAGE_KEYS.ALL_USERS, [DEMO_STUDENT]);
    allUsers.push(newUser);
    this.safeSet(STORAGE_KEYS.ALL_USERS, allUsers);
    this.setCurrentUser(newUser);
    return newUser;
  }

  loginUser(identifier: string): StudentUser {
    const allUsers = this.safeGet<StudentUser[]>(STORAGE_KEYS.ALL_USERS, [DEMO_STUDENT]);
    const match = allUsers.find(
      (u) =>
        u.email.toLowerCase() === identifier.toLowerCase() ||
        u.mobile.replace(/\D/g, '') === identifier.replace(/\D/g, '')
    );

    if (match) {
      this.setCurrentUser(match);
      return match;
    }

    // Default to demo student if logging in with test identifiers
    const userToLogin = {
      ...DEMO_STUDENT,
      fullName: identifier.includes('@') ? identifier.split('@')[0].toUpperCase() : 'Student ' + identifier.slice(-4),
      email: identifier.includes('@') ? identifier : `${identifier}@student.upboard.in`,
      mobile: identifier.includes('@') ? '9876543210' : identifier,
    };
    this.setCurrentUser(userToLogin);
    return userToLogin;
  }

  updateProfile(updates: Partial<StudentUser>): StudentUser | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...updates };
    this.setCurrentUser(updated);

    const allUsers = this.safeGet<StudentUser[]>(STORAGE_KEYS.ALL_USERS, [DEMO_STUDENT]);
    const index = allUsers.findIndex((u) => u.id === current.id);
    if (index !== -1) {
      allUsers[index] = updated;
      this.safeSet(STORAGE_KEYS.ALL_USERS, allUsers);
    }
    return updated;
  }

  toggleBookmarkMaterial(materialId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const isSaved = user.savedMaterialIds.includes(materialId);
    const newSaved = isSaved
      ? user.savedMaterialIds.filter((id) => id !== materialId)
      : [...user.savedMaterialIds, materialId];
    this.updateProfile({ savedMaterialIds: newSaved });
    return !isSaved;
  }

  toggleBookmarkPaper(paperId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const isBookmarked = user.bookmarkedPaperIds.includes(paperId);
    const newBookmarked = isBookmarked
      ? user.bookmarkedPaperIds.filter((id) => id !== paperId)
      : [...user.bookmarkedPaperIds, paperId];
    this.updateProfile({ bookmarkedPaperIds: newBookmarked });
    return !isBookmarked;
  }

  recordQuizScore(quizId: string, quizTitle: string, score: number, total: number): void {
    const user = this.getCurrentUser();
    if (!user) return;
    const newScore = {
      quizId,
      quizTitle,
      score,
      total,
      date: new Date().toISOString().split('T')[0],
    };
    const scores = [newScore, ...user.quizScores.filter((q) => q.quizId !== quizId)];
    this.updateProfile({ quizScores: scores, completedLessonCount: user.completedLessonCount + 1 });
  }

  // --- Live Classes ---
  getLiveClasses(): LiveClassItem[] {
    return this.safeGet<LiveClassItem[]>(STORAGE_KEYS.LIVE_CLASSES, LIVE_CLASSES_DATA);
  }

  saveLiveClasses(items: LiveClassItem[]): void {
    this.safeSet(STORAGE_KEYS.LIVE_CLASSES, items);
  }

  addLiveClass(item: LiveClassItem): void {
    const current = this.getLiveClasses();
    this.saveLiveClasses([item, ...current]);
  }

  updateLiveClass(item: LiveClassItem): void {
    const current = this.getLiveClasses();
    const updated = current.map((c) => (c.id === item.id ? item : c));
    this.saveLiveClasses(updated);
  }

  deleteLiveClass(id: string): void {
    const current = this.getLiveClasses();
    this.saveLiveClasses(current.filter((c) => c.id !== id));
  }

  toggleLiveStatus(id: string): void {
    const current = this.getLiveClasses();
    const updated = current.map((c) => {
      if (c.id === id) {
        return { ...c, isLiveNow: !c.isLiveNow, isCompleted: false };
      }
      return c;
    });
    this.saveLiveClasses(updated);
  }

  // --- Reminders ---
  getReminders(): string[] {
    return this.safeGet<string[]>(STORAGE_KEYS.REMINDERS, []);
  }

  toggleReminder(classId: string): boolean {
    const reminders = this.getReminders();
    const exists = reminders.includes(classId);
    const updated = exists ? reminders.filter((id) => id !== classId) : [...reminders, classId];
    this.safeSet(STORAGE_KEYS.REMINDERS, updated);
    return !exists;
  }

  // --- Study Materials (Notes, PPTs, Solutions) ---
  getStudyMaterials(): StudyMaterialItem[] {
    return this.safeGet<StudyMaterialItem[]>(STORAGE_KEYS.STUDY_MATERIALS, STUDY_MATERIALS_DATA);
  }

  addStudyMaterial(item: StudyMaterialItem): void {
    const current = this.getStudyMaterials();
    this.safeSet(STORAGE_KEYS.STUDY_MATERIALS, [item, ...current]);
  }

  deleteStudyMaterial(id: string): void {
    const current = this.getStudyMaterials();
    this.safeSet(
      STORAGE_KEYS.STUDY_MATERIALS,
      current.filter((m) => m.id !== id)
    );
  }

  // --- Question Papers (PYQ) ---
  getQuestionPapers(): QuestionPaperItem[] {
    return this.safeGet<QuestionPaperItem[]>(STORAGE_KEYS.QUESTION_PAPERS, QUESTION_PAPERS_DATA);
  }

  addQuestionPaper(item: QuestionPaperItem): void {
    const current = this.getQuestionPapers();
    this.safeSet(STORAGE_KEYS.QUESTION_PAPERS, [item, ...current]);
  }

  deleteQuestionPaper(id: string): void {
    const current = this.getQuestionPapers();
    this.safeSet(
      STORAGE_KEYS.QUESTION_PAPERS,
      current.filter((p) => p.id !== id)
    );
  }

  // --- UPMSP Notifications ---
  getNotifications(): UpNotificationItem[] {
    return this.safeGet<UpNotificationItem[]>(STORAGE_KEYS.UP_NOTIFICATIONS, UPMSP_NOTIFICATIONS_DATA);
  }

  addNotification(item: UpNotificationItem): void {
    const current = this.getNotifications();
    this.safeSet(STORAGE_KEYS.UP_NOTIFICATIONS, [item, ...current]);
  }

  deleteNotification(id: string): void {
    const current = this.getNotifications();
    this.safeSet(
      STORAGE_KEYS.UP_NOTIFICATIONS,
      current.filter((n) => n.id !== id)
    );
  }

  // --- Student Notification Center ---
  getStudentNotifications(): StudentNotificationItem[] {
    return this.safeGet<StudentNotificationItem[]>(STORAGE_KEYS.STUDENT_NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  markNotificationAsRead(id: string): void {
    const current = this.getStudentNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.safeSet(STORAGE_KEYS.STUDENT_NOTIFICATIONS, updated);
  }

  pushStudentNotification(item: StudentNotificationItem): void {
    const current = this.getStudentNotifications();
    this.safeSet(STORAGE_KEYS.STUDENT_NOTIFICATIONS, [item, ...current]);
  }

  // --- Enquiries ---
  getEnquiries(): EnquiryItem[] {
    return this.safeGet<EnquiryItem[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  }

  submitEnquiry(enquiry: Omit<EnquiryItem, 'id' | 'createdAt' | 'status'>): EnquiryItem {
    const newEnquiry: EnquiryItem = {
      ...enquiry,
      id: 'enq-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'New',
    };
    const current = this.getEnquiries();
    this.safeSet(STORAGE_KEYS.ENQUIRIES, [newEnquiry, ...current]);

    // Send asynchronously to Supabase backend table 'enquiries'
    submitSupabaseEnquiry({
      studentName: enquiry.studentName,
      parentName: enquiry.parentName,
      mobile: enquiry.mobile,
      email: enquiry.email,
      classLevel: enquiry.classLevel,
      subject: enquiry.subject,
      message: enquiry.message,
    }).catch((err) => console.warn('Supabase async enquiry error:', err));

    return newEnquiry;
  }

  updateEnquiryStatus(id: string, status: 'New' | 'Contacted' | 'Closed'): void {
    const current = this.getEnquiries();
    const updated = current.map((e) => (e.id === id ? { ...e, status } : e));
    this.safeSet(STORAGE_KEYS.ENQUIRIES, updated);
  }

  deleteEnquiry(id: string): void {
    const current = this.getEnquiries();
    this.safeSet(
      STORAGE_KEYS.ENQUIRIES,
      current.filter((e) => e.id !== id)
    );
  }

  // --- Daily 50 Quizzes ---
  getDailyQuizzes(): FiftyQuizQuestion[] {
    return this.safeGet<FiftyQuizQuestion[]>(STORAGE_KEYS.DAILY_QUIZZES, FIFTY_LIVE_QUIZZES);
  }

  saveDailyQuizzes(questions: FiftyQuizQuestion[]): void {
    this.safeSet(STORAGE_KEYS.DAILY_QUIZZES, questions);
  }

  updateDailyQuizQuestion(index: number, question: FiftyQuizQuestion): void {
    const quizzes = [...this.getDailyQuizzes()];
    if (index >= 0 && index < quizzes.length) {
      quizzes[index] = question;
      this.saveDailyQuizzes(quizzes);
    }
  }

  addDailyQuizQuestion(question: FiftyQuizQuestion): void {
    const quizzes = [...this.getDailyQuizzes()];
    quizzes.push(question);
    this.saveDailyQuizzes(quizzes);
  }

  deleteDailyQuizQuestion(index: number): void {
    const quizzes = [...this.getDailyQuizzes()];
    if (index >= 0 && index < quizzes.length) {
      quizzes.splice(index, 1);
      this.saveDailyQuizzes(quizzes);
    }
  }

  // --- Admin Settings ---
  getAdminSettings(): AdminSettings {
    return this.safeGet<AdminSettings>(STORAGE_KEYS.ADMIN_SETTINGS, DEFAULT_ADMIN_SETTINGS_WITH_VIDEO);
  }

  saveAdminSettings(settings: AdminSettings): void {
    this.safeSet(STORAGE_KEYS.ADMIN_SETTINGS, settings);
  }

  updateHomeFeaturedVideo(video: NonNullable<AdminSettings['homeFeaturedVideo']>): void {
    const settings = this.getAdminSettings();
    settings.homeFeaturedVideo = video;
    this.saveAdminSettings(settings);
  }

  // --- Chapters & Subjects Video Links Management (Admin Configurable) ---
  getChapters(): ChapterItem[] {
    return this.safeGet<ChapterItem[]>(STORAGE_KEYS.CHAPTERS, ALL_CHAPTERS_DATA);
  }

  getChaptersBySubject(classLevel: ClassLevel, subjectCode: string): ChapterItem[] {
    const all = this.getChapters();
    return all.filter(
      (ch) => ch.classLevel === classLevel && ch.subjectCode.toUpperCase() === subjectCode.toUpperCase()
    );
  }

  saveChapter(chapter: ChapterItem): void {
    const list = this.getChapters();
    const idx = list.findIndex((c) => c.id === chapter.id);
    if (idx >= 0) {
      list[idx] = chapter;
    } else {
      list.push(chapter);
    }
    this.safeSet(STORAGE_KEYS.CHAPTERS, list);
  }

  deleteChapter(chapterId: string): void {
    const list = this.getChapters().filter((c) => c.id !== chapterId);
    this.safeSet(STORAGE_KEYS.CHAPTERS, list);
  }

  getSubjects(): SubjectItem[] {
    return this.safeGet<SubjectItem[]>(STORAGE_KEYS.SUBJECTS, SUBJECTS_DATA);
  }

  saveSubject(subject: SubjectItem): void {
    const list = this.getSubjects();
    const idx = list.findIndex((s) => s.id === subject.id);
    if (idx >= 0) {
      list[idx] = subject;
    } else {
      list.push(subject);
    }
    this.safeSet(STORAGE_KEYS.SUBJECTS, list);
  }

  deleteSubject(subjectId: string): void {
    const list = this.getSubjects().filter((s) => s.id !== subjectId);
    this.safeSet(STORAGE_KEYS.SUBJECTS, list);
  }

  // --- Download Official Document Helper (Formatted Visual Document Blob) ---
  downloadResource(title: string, _type: 'pdf' | 'ppt' | 'notes', details: Record<string, any> = {}): void {
    const escapeHtml = (str: string) =>
      String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const safeTitle = escapeHtml(title);
    const safeSummary = escapeHtml(
      details.summary || 'NCERT and UP Board syllabus compliant notes prepared by senior coaching evaluators.'
    );
    const safeTopics = Array.isArray(details.keyTopics)
      ? details.keyTopics.map((t: string) => `<li>${escapeHtml(t)}</li>`).join('')
      : '';

    const formattedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${safeTitle} - UP BOARD COACHING</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Mukta', 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 25px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 24px; }
    .title { font-size: 22pt; font-weight: bold; color: #1e3a8a; margin: 0; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 11pt; margin-bottom: 6px; }
    .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin-bottom: 20px; background: #f8fafc; }
    .box-title { font-weight: bold; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; font-size: 13pt; }
    .topic-list li { margin-bottom: 6px; }
    .footer { text-align: center; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 10pt; color: #64748b; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">UTTAR PRADESH MADHYAMIK SHIKSHA PARISHAD (UPMSP)</div>
    <h1 class="title">${safeTitle}</h1>
    <p style="color: #64748b; font-size: 12pt; margin-top: 4px;">Official Study Material & Student Resource Portal</p>
  </div>
  <div class="box">
    <div class="box-title">📖 Chapter Summary & Revision Highlights</div>
    <p>${safeSummary}</p>
    ${
      safeTopics
        ? `<div style="margin-top: 14px;"><strong>Key Topics Covered:</strong><ul class="topic-list">${safeTopics}</ul></div>`
        : ''
    }
  </div>
  <div class="footer">
    UP BOARD COACHING • https://upboardcoaching.netlify.app • YouTube: @UPBoard_Coaching
  </div>
</body>
</html>`;

    const blob = new Blob([formattedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    const cleanFileName = title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 40);
    anchor.download = `UP_BOARD_${cleanFileName}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();
