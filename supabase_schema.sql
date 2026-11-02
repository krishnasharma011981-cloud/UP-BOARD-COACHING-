-- =========================================================================
-- UP BOARD COACHING — Complete Supabase PostgreSQL Schema
-- Project Reference: uolvqremklljqgoutdbl
-- Supabase URL: https://uolvqremklljqgoutdbl.supabase.co
-- Follows Supabase Postgres Best Practices (RLS enabled, explicit TO anon/authenticated,
-- proper foreign keys, performance indexes, and initial starter data)
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. ADMISSION & STUDENT ENQUIRIES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    parent_name TEXT DEFAULT '',
    mobile TEXT NOT NULL,
    email TEXT DEFAULT '',
    class_level TEXT NOT NULL,
    subject TEXT DEFAULT 'Complete Board Exam Target Batch',
    district TEXT DEFAULT 'Uttar Pradesh',
    message TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Anyone can submit admission enquiry" ON public.enquiries;
DROP POLICY IF EXISTS "Allow anon and auth read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow auth update enquiries" ON public.enquiries;

CREATE POLICY "Anyone can submit admission enquiry"
ON public.enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anon and auth read enquiries"
ON public.enquiries
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow auth update enquiries"
ON public.enquiries
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- =========================================================================
-- 2. REGISTERED STUDENTS & PROFILES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT NOT NULL,
    class_level TEXT NOT NULL DEFAULT 'Class 12',
    district TEXT NOT NULL DEFAULT 'Prayagraj',
    school_name TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own profile" ON public.students;
DROP POLICY IF EXISTS "Students can insert own profile" ON public.students;
DROP POLICY IF EXISTS "Students can update own profile" ON public.students;
DROP POLICY IF EXISTS "Allow anon read students list" ON public.students;
DROP POLICY IF EXISTS "Allow anon insert student registration" ON public.students;

CREATE POLICY "Students can view own profile"
ON public.students
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id OR (SELECT auth.uid()) = id);

CREATE POLICY "Allow anon read students list"
ON public.students
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon insert student registration"
ON public.students
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Students can update own profile"
ON public.students
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id OR (SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = user_id OR (SELECT auth.uid()) = id);

-- =========================================================================
-- 3. 50 LIVE QUIZ & MOCK TEST ATTEMPTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    quiz_title TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 50,
    accuracy INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can record their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Allow anon insert for unauthenticated live quiz" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Allow anon view all quiz scores" ON public.quiz_attempts;

CREATE POLICY "Allow anon view all quiz scores"
ON public.quiz_attempts
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow anon insert for unauthenticated live quiz"
ON public.quiz_attempts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- =========================================================================
-- 4. LIVE CLASSES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.live_classes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_hindi TEXT,
    subject TEXT NOT NULL,
    class_level TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    youtube_video_id TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    description TEXT,
    is_live BOOLEAN NOT NULL DEFAULT false,
    viewers_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view live classes" ON public.live_classes;
DROP POLICY IF EXISTS "Admin can manage live classes" ON public.live_classes;

CREATE POLICY "Public can view live classes"
ON public.live_classes
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage live classes"
ON public.live_classes
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- =========================================================================
-- 5. STUDY MATERIALS, NOTES & PPTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.study_materials (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    class_level TEXT NOT NULL,
    subject TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'notes',
    chapter_title TEXT,
    file_size TEXT DEFAULT '4.2 MB',
    download_url TEXT,
    summary TEXT,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view study materials" ON public.study_materials;
DROP POLICY IF EXISTS "Admin can manage study materials" ON public.study_materials;

CREATE POLICY "Public can view study materials"
ON public.study_materials
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage study materials"
ON public.study_materials
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- =========================================================================
-- 6. OFFICIAL UPMSP CIRCULARS & NOTIFICATIONS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.upmsp_circulars (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_hindi TEXT,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    circular_number TEXT,
    pdf_url TEXT,
    is_urgent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.upmsp_circulars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view circulars" ON public.upmsp_circulars;
DROP POLICY IF EXISTS "Admin can manage circulars" ON public.upmsp_circulars;

CREATE POLICY "Public can view circulars"
ON public.upmsp_circulars
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage circulars"
ON public.upmsp_circulars
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- =========================================================================
-- 7. PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_class_level ON public.enquiries(class_level);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_mobile ON public.students(mobile);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON public.quiz_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_classes_class_level ON public.live_classes(class_level);
CREATE INDEX IF NOT EXISTS idx_study_materials_subject ON public.study_materials(subject);
CREATE INDEX IF NOT EXISTS idx_upmsp_circulars_date ON public.upmsp_circulars(date DESC);

-- =========================================================================
-- 8. GRANT PRIVILEGES TO ROLES
-- =========================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.enquiries TO anon, authenticated;
GRANT ALL ON TABLE public.students TO anon, authenticated;
GRANT ALL ON TABLE public.quiz_attempts TO anon, authenticated;
GRANT ALL ON TABLE public.live_classes TO anon, authenticated;
GRANT ALL ON TABLE public.study_materials TO anon, authenticated;
GRANT ALL ON TABLE public.upmsp_circulars TO anon, authenticated;

-- =========================================================================
-- 9. INITIAL SEED DATA (Ready-to-use sample records)
-- =========================================================================
INSERT INTO public.enquiries (student_name, parent_name, mobile, email, class_level, subject, district, message)
VALUES
('Rahul Tiwari', 'Manoj Tiwari', '9876543210', 'rahul.tiwari@example.com', '12 - senior secondary', 'Physics & Mathematics Target 2027', 'Prayagraj', 'Admission inquiry for Class 12 board batch'),
('Pooja Maurya', 'Dinesh Maurya', '9811223344', 'pooja.m@example.com', '10 - secondary', 'Science & Mathematics High School', 'Varanasi', 'Interested in Daily 50 MCQ Live Test series')
ON CONFLICT DO NOTHING;

INSERT INTO public.live_classes (id, title, title_hindi, subject, class_level, teacher_name, youtube_video_id, date, time, description, is_live, viewers_count)
VALUES
('live-01', 'Class 12 Physics: Electrostatics & Coulomb’s Law Full Chapter Revision', 'कक्षा 12 भौतिक विज्ञान: वैद्युत आवेश एवं क्षेत्र महामैराथन', 'Physics', '12 - senior secondary', 'Er. Rakesh Sharma', 'jfKfPfyJRdk', 'Today', '07:30 PM IST', 'Coulomb law, Electric field lines, Gauss theorem derivations and top 15 numericals.', true, 4280),
('live-02', 'Class 10 Mathematics: Quadratic Equations Top 20 Questions', 'कक्षा 10 गणित: द्विघात समीकरण एवं त्रिभुज महत्वपूर्ण प्रश्न', 'Mathematics', '10 - secondary', 'Vipin Kumar Sir', 'jfKfPfyJRdk', 'Tomorrow', '06:00 PM IST', 'Solving 20 high-weightage subjective questions with step-by-step marking guidelines.', false, 1250)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.upmsp_circulars (id, title, category, date, circular_number, pdf_url, is_urgent)
VALUES
('upmsp-2027-01', 'UPMSP High School & Intermediate Examination 2027 Form Submission Schedule Released', 'Time Table', '01 Nov 2026', 'UPMSP/EXAM/2026/8941', 'https://upmsp.edu.in', true),
('upmsp-2027-02', 'Revised 30% Deleted Syllabus & New 20-OMR Evaluation Guidelines for Board Exams', 'Syllabus', '28 Oct 2026', 'UPMSP/ACAD/2026/332', 'https://upmsp.edu.in', false)
ON CONFLICT (id) DO NOTHING;
