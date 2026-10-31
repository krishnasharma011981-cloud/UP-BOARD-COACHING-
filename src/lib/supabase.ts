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
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

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

// Create client conditionally or fallback gracefully
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
    throw new Error('Supabase client is not configured with an Anon Key.');
  }

  // 1. Supabase Auth SignUp
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password || 'UpBoard@2027',
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
    throw authError;
  }

  // 2. Insert into public.students profile table
  if (authData.user) {
    const { error: profileError } = await supabase.from('students').upsert({
      id: authData.user.id,
      full_name: data.fullName,
      email: data.email,
      mobile: data.mobile,
      class_level: data.classLevel,
      district: data.district,
      school_name: data.schoolName,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.warn('Profile sync notice:', profileError.message);
    }
  }

  return authData;
}

/**
 * Helper to log in a student with Supabase Auth
 */
export async function loginStudentWithSupabase(email: string, password?: string) {
  if (!supabase) {
    throw new Error('Supabase client is not configured with an Anon Key.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: password || 'UpBoard@2027',
  });

  if (error) {
    throw error;
  }

  return data;
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
