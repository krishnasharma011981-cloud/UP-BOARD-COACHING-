/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageView =
  | 'home'
  | 'about'
  | 'courses'
  | 'class-9'
  | 'class-10'
  | 'class-11'
  | 'class-12'
  | 'live-classes'
  | 'live-quiz'
  | 'study-material'
  | 'previous-year-papers'
  | 'notifications'
  | 'exam-calendar'
  | 'student-portal'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'admin'
  | 'not-found';

export type ClassLevel = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export interface SubjectItem {
  id: string;
  name: string;
  nameHindi: string;
  code: string;
  classLevel: ClassLevel;
  totalChapters: number;
  iconName: string;
  color: string;
  description: string;
}

export interface LiveClassItem {
  id: string;
  title: string;
  titleHindi: string;
  subject: string;
  classLevel: ClassLevel;
  teacherName: string;
  teacherRole: string;
  date: string;
  time: string;
  scheduledDateTime: string;
  durationMinutes: number;
  isLiveNow: boolean;
  isCompleted: boolean;
  youtubeVideoId: string;
  viewersCount: number;
  description: string;
  pptDownloadUrl?: string;
  pdfNotesUrl?: string;
  formulaSheetUrl?: string;
  chapterTopic: string;
}

export interface StudyMaterialItem {
  id: string;
  title: string;
  titleHindi: string;
  classLevel: ClassLevel;
  subject: string;
  chapterNumber: number;
  chapterTitle: string;
  type: 'notes' | 'ppt' | 'formula_sheet' | 'important_qa' | 'ncert_solution';
  fileSize: string;
  pageCount: number;
  downloadsCount: number;
  uploadDate: string;
  summary: string;
  keyTopics: string[];
  contentSample?: string;
  sampleQuestions?: Array<{ q: string; a: string; marks: number }>;
}

export interface QuestionPaperItem {
  id: string;
  title: string;
  classLevel: ClassLevel;
  subject: string;
  year: number;
  medium: 'Hindi' | 'English';
  paperType: 'Official Board Paper' | 'Official Model Paper' | 'Pre-Board Mock';
  maxMarks: number;
  duration: string;
  hasSolution: boolean;
  fileSize: string;
  downloadCount: number;
  paperCode: string;
  solutionHighlights?: string[];
}

export interface UpNotificationItem {
  id: string;
  title: string;
  titleHindi: string;
  publishDate: string;
  category: 'Time Table' | 'Admit Card' | 'Practical Exams' | 'Syllabus' | 'Result' | 'Model Paper' | 'Registration';
  description: string;
  isUrgent: boolean;
  officialSourceUrl: string;
  relevantClass: 'All Classes' | 'Class 10 & 12' | 'Class 10' | 'Class 12' | 'Class 9 & 11';
  pdfDownloadAvailable?: boolean;
}

export interface PracticeQuizQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface PracticeQuiz {
  id: string;
  title: string;
  subject: string;
  classLevel: ClassLevel;
  chapter: string;
  questions: PracticeQuizQuestion[];
  timeLimitMinutes: number;
}

export interface StudentUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  classLevel: ClassLevel;
  targetExamYear: string;
  schoolName: string;
  district: string;
  enrolledSubjects: string[];
  savedMaterialIds: string[];
  bookmarkedPaperIds: string[];
  completedLessonCount: number;
  quizScores: Array<{
    quizId: string;
    quizTitle: string;
    score: number;
    total: number;
    date: string;
  }>;
  createdAt: string;
}

export interface EnquiryItem {
  id: string;
  studentName: string;
  parentName?: string;
  mobile: string;
  email?: string;
  classLevel: ClassLevel;
  subject: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Closed';
}

export interface StudentNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  classLevel: 'All' | ClassLevel;
  type: 'live' | 'exam' | 'material' | 'urgent';
  read: boolean;
  actionUrl?: string;
}

export interface ChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  titleHindi: string;
  subjectCode: string;
  classLevel: ClassLevel;
  topics: string[];
  youtubeVideoId: string;
  youtubeUrl?: string;
  duration?: string;
}

export interface AdminSettings {
  youtubeChannelId: string;
  youtubeChannelHandle: string;
  apiKeyConfigured: boolean;
  emergencyBannerText: string;
  emergencyBannerActive: boolean;
  examDateIso: string;
  examTitle: string;
  homeFeaturedVideo?: {
    title: string;
    titleHindi: string;
    subject: string;
    classLevel: ClassLevel;
    teacherName: string;
    youtubeVideoId: string;
    thumbnailUrl?: string;
    isLive: boolean;
  };
}

export interface HomeSliderItem {
  id: string;
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  targetPage: PageView;
  gradient: string;
  imageUrl?: string;
  isFounderSlide?: boolean;
}
