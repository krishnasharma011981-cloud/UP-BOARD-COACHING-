/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration for project: uolvqremklljqgoutdbl
export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://uolvqremklljqgoutdbl.supabase.co';

export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_nqj2i6dTULfrYRSwc3n0tQ_ZvJuXRSI';

/**
 * Returns true if a valid Supabase anon key is provided
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_ANON_KEY &&
      SUPABASE_ANON_KEY.trim() !== '' &&
      SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
  );
};

// Create client with persistent auth session
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Helper to register a student with Supabase Auth & public.students table
 */
export async function registerStudentWithSupabase(data: {
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
  classLevel: string;
  district: string;
  schoolName: string;
}) {
  if (!supabase) {
    console.warn('Supabase client is not configured.');
    return null;
  }

  // Sanitize email: if mobile provided without @, make a valid email format for Supabase Auth
  const cleanMobile = data.mobile.replace(/\D/g, '');
  const authEmail = data.email && data.email.includes('@')
    ? data.email.trim().toLowerCase()
    : `student_${cleanMobile || Date.now()}@upboard.in`;

  const authPassword = data.password && data.password.length >= 6
    ? data.password
    : 'UpBoard@2027';

  // 1. Supabase Auth SignUp - appears directly in Supabase Authentication Dashboard!
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: authEmail,
    password: authPassword,
    options: {
      data: {
        full_name: data.fullName,
        mobile: data.mobile,
        class_level: data.classLevel,
        district: data.district,
        school_name: data.schoolName,
      },
    },
  });

  if (authError) {
    console.warn('Supabase Auth SignUp notice:', authError.message);
  }

  // 2. Insert into public.students profile table
  try {
    const studentRecord = {
      id: authData.user?.id || undefined,
      full_name: data.fullName,
      email: authEmail,
      mobile: data.mobile,
      class_level: data.classLevel,
      district: data.district || 'Uttar Pradesh',
      school_name: data.schoolName || 'UPMSP Affiliated School',
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase.from('students').upsert(studentRecord);
    if (profileError) {
      console.warn('Students table upsert note:', profileError.message);
    }
  } catch (err) {
    console.warn('Profile sync exception:', err);
  }

  return authData;
}

/**
 * Helper to log in a student with Supabase Auth
 */
export async function loginStudentWithSupabase(identifier: string, password?: string) {
  if (!supabase) {
    return null;
  }

  const cleanMobile = identifier.replace(/\D/g, '');
  const emailToUse = identifier.includes('@')
    ? identifier.trim().toLowerCase()
    : `student_${cleanMobile}@upboard.in`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password: password || 'UpBoard@2027',
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Submit Admission Enquiry to Supabase Backend table 'enquiries'
 */
export async function submitSupabaseEnquiry(enquiry: {
  studentName: string;
  parentName?: string;
  mobile: string;
  email?: string;
  classLevel: string;
  subject: string;
  message: string;
}) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('enquiries').insert([
      {
        student_name: enquiry.studentName,
        parent_name: enquiry.parentName || '',
        mobile: enquiry.mobile,
        email: enquiry.email || '',
        class_level: enquiry.classLevel,
        subject: enquiry.subject,
        message: enquiry.message,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('Supabase enquiry insert warning:', error.message);
    }
    return data;
  } catch (err) {
    console.warn('Could not send enquiry to Supabase:', err);
    return null;
  }
}

/**
 * Fetch all enquiries from Supabase Backend
 */
export async function fetchSupabaseEnquiries() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching enquiries from Supabase:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Failed to fetch enquiries from Supabase:', err);
    return [];
  }
}

/**
 * Fetch all registered students from Supabase
 */
export async function fetchSupabaseStudents() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Error fetching students from Supabase:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Failed to fetch students from Supabase:', err);
    return [];
  }
}

/**
 * Helper to record a quiz score in Supabase
 */
export async function recordSupabaseQuizScore(
  userId: string,
  quizTitle: string,
  score: number,
  total: number
) {
  if (!supabase) return;

  try {
    await supabase.from('quiz_attempts').insert({
      user_id: userId,
      quiz_title: quizTitle,
      score,
      total_questions: total,
      accuracy: Math.round((score / total) * 100),
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not record quiz to Supabase:', err);
  }
}

/**
 * Diagnostic helper to test the presence of required tables on Supabase
 */
export async function checkSupabaseTableStatus(): Promise<
  Record<string, { exists: boolean; count: number; error?: string }>
> {
  const tables = [
    'enquiries',
    'students',
    'quiz_attempts',
    'live_classes',
    'study_materials',
    'upmsp_circulars',
  ];

  const results: Record<string, { exists: boolean; count: number; error?: string }> = {};

  if (!supabase) {
    for (const tbl of tables) {
      results[tbl] = { exists: false, count: 0, error: 'Supabase client not initialized' };
    }
    return results;
  }

  for (const tbl of tables) {
    try {
      const { count, error } = await supabase
        .from(tbl)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results[tbl] = { exists: false, count: 0, error: error.message };
      } else {
        results[tbl] = { exists: true, count: count ?? 0 };
      }
    } catch (e: any) {
      results[tbl] = { exists: false, count: 0, error: e?.message || 'Check failed' };
    }
  }

  return results;
}
