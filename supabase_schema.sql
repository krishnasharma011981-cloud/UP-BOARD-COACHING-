-- =========================================================================
-- UP BOARD COACHING — Supabase PostgreSQL Schema
-- Project Reference: uolvqremklljqgoutdbl
-- Host: db.uolvqremklljqgoutdbl.supabase.co
-- Follows Supabase Postgres Best Practices (RLS, explicit roles, optimized indexes)
-- =========================================================================

-- 1. STUDENTS PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT NOT NULL,
    class_level TEXT NOT NULL DEFAULT 'Class 10',
    district TEXT NOT NULL DEFAULT 'Prayagraj',
    school_name TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Students RLS Policies
CREATE POLICY "Students can view own profile"
ON public.students
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Students can insert own profile"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Students can update own profile"
ON public.students
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- 2. QUIZ ATTEMPTS TABLE (50 Live Quiz & Practice Tests)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_title TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    accuracy INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quiz Attempts RLS Policies
CREATE POLICY "Users can view their own quiz attempts"
ON public.quiz_attempts
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can record their own quiz attempts"
ON public.quiz_attempts
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Allow anon insert for unauthenticated live quiz participants"
ON public.quiz_attempts
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- 3. ADMISSION ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    class_level TEXT NOT NULL,
    district TEXT,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Enquiries RLS: anyone (anon or authenticated) can submit an enquiry
CREATE POLICY "Anyone can submit admission enquiry"
ON public.enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON public.quiz_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

-- 5. GRANTS TO ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.students TO authenticated;
GRANT ALL ON TABLE public.quiz_attempts TO anon, authenticated;
GRANT INSERT ON TABLE public.enquiries TO anon, authenticated;
