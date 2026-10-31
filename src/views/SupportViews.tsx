/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  Shield,
  FileText,
  Youtube,
  Send,
} from 'lucide-react';
import { PageView } from '../types';
import { FAQ_ITEMS, HERO_IMAGE, TOPPER_AVATAR } from '../data/mockData';

// --- ABOUT US VIEW ---
export const AboutView: React.FC<{ onNavigate: (page: PageView) => void; onOpenEnquiry: () => void }> = ({
  onNavigate,
  onOpenEnquiry,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Our Story & Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          About UP BOARD COCHING
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Founded with a single mission: To provide affordable, world-class education and free YouTube lectures to every high school and intermediate student across Uttar Pradesh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
            Bridging the Quality Gap in UP State Board Education
          </h2>
          <p>
            For decades, UP Board students studying in Hindi and English medium have faced a severe lack of structured study resources, accurate NCERT solutions, and quality live instruction compared to central boards.
          </p>
          <p>
            <strong>UP BOARD COCHING</strong> was established by a consortium of senior UP educators, gold-medalist subject specialists, and past board evaluators from Prayagraj, Lucknow, and Varanasi. We believe that financial hardship should never stop a talented student from scoring in the State Top 10 Merit List.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <span className="font-heading font-extrabold text-2xl text-blue-900">45k+</span>
              <p className="text-xs text-slate-600 mt-1">Students Prepared Annually</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <span className="font-heading font-extrabold text-2xl text-amber-600">100%</span>
              <p className="text-xs text-slate-600 mt-1">Free Daily YouTube Live Access</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <img
            src={HERO_IMAGE}
            alt="About UP Board Coaching"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h3 className="font-heading font-bold text-2xl">
          Want To Score Above 95% in UP Board 2027?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Join our daily interactive live batches on YouTube or register in the Student Portal for complete handwritten chapter notes.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => onNavigate('live-classes')}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Watch Free Classes
          </button>
          <button
            onClick={onOpenEnquiry}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Contact Mentors
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CONTACT US VIEW ---
export const ContactView: React.FC<{ onOpenEnquiry: () => void }> = ({ onOpenEnquiry }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Student Support & Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          Contact UP BOARD COACHING
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Have an academic doubt, need study material help, or want admission guidance? Reach our faculty directly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Phone 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">Phone Support 1</h3>
          <p className="text-xs text-slate-500">Call / WhatsApp Support</p>
          <a href="tel:7518177177" className="text-sm font-bold text-blue-700 hover:underline block">
            +91 7518177177
          </a>
        </div>

        {/* Phone 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">Phone Support 2</h3>
          <p className="text-xs text-slate-500">Admissions & Counseling</p>
          <a href="tel:7518786238" className="text-sm font-bold text-blue-700 hover:underline block">
            +91 7518786238
          </a>
        </div>

        {/* Support Email */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">Official Support Email</h3>
          <p className="text-xs text-slate-500">Queries & Study Material Help</p>
          <a
            href="mailto:ASHISHPANDEYTUTORIALS@GMAIL.COM"
            className="text-xs font-bold text-slate-800 hover:text-blue-700 break-all block"
          >
            ASHISHPANDEYTUTORIALS@GMAIL.COM
          </a>
        </div>

        {/* WhatsApp Direct */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">WhatsApp Mentor</h3>
          <p className="text-xs text-slate-500">Instant doubt answers</p>
          <a
            href="https://wa.me/917518177177"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-emerald-600 hover:underline block"
          >
            Chat: 7518177177 &rarr;
          </a>
        </div>

        {/* YouTube Channel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <Youtube className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">YouTube Channel</h3>
          <p className="text-xs text-slate-500">Live Classes & Video Solutions</p>
          <a
            href="https://www.youtube.com/@UPBoard_Coaching"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-red-600 hover:underline block truncate"
          >
            @UPBoard_Coaching &rarr;
          </a>
        </div>

        {/* Telegram Community */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">Telegram Community</h3>
          <p className="text-xs text-slate-500">Notes, PDFs & Circulars</p>
          <a
            href="https://t.me/NIOSHELPLINEAPRIL2027"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-sky-600 hover:underline block truncate"
          >
            @NIOSHELPLINEAPRIL2027 &rarr;
          </a>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4 max-w-xl mx-auto">
        <h3 className="font-heading font-bold text-lg text-slate-900">
          Want To Send a Detailed Academic Query?
        </h3>
        <p className="text-xs text-slate-600">
          Fill out our comprehensive admission enquiry form and get a callback from our subject counselors.
        </p>
        <button
          onClick={onOpenEnquiry}
          className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
        >
          Open Enquiry Form
        </button>
      </div>
    </div>
  );
};

// --- FAQ VIEW ---
export const FaqView: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Student & Parent Help Center
        </span>
        <h1 className="text-3xl font-heading font-extrabold text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything regarding our free online coaching, notes download, YouTube live classes, and UP Board examination rules.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-semibold text-sm text-slate-900 cursor-pointer"
              >
                <span>{item.q}</span>
                <span className="text-base text-slate-400 shrink-0">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- PRIVACY POLICY VIEW ---
export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs text-slate-700 leading-relaxed">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-slate-500 text-xs">Last updated: October 2026</p>
      </div>

      <p>
        At <strong>UP BOARD COCHING</strong> (accessible from our web app and official YouTube channel), the privacy of our students and visitors is of paramount importance. This document outlines the types of information collected and how we use it.
      </p>

      <h3 className="font-heading font-bold text-sm text-slate-900">1. Information We Collect</h3>
      <p>
        When you register on our Student Portal or submit an admission enquiry, we may collect your name, email address, mobile number (for WhatsApp updates and batch alerts), school name, and opted UP Board class.
      </p>

      <h3 className="font-heading font-bold text-sm text-slate-900">2. How We Use Your Information</h3>
      <p>
        Your data is strictly utilized to provide live class notifications, grant access to downloadable notes and PPTs, track your quiz progress, and send official UPMSP date sheet announcements. We NEVER sell or share student data with third-party telemarketers.
      </p>

      <h3 className="font-heading font-bold text-sm text-slate-900">3. Cookies & Local Storage</h3>
      <p>
        We use browser local storage to remember your login session, bookmark saved notes, and store your practice test performance locally on your device for immediate access.
      </p>
    </div>
  );
};

// --- TERMS AND CONDITIONS VIEW ---
export const TermsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs text-slate-700 leading-relaxed">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Terms and Conditions</h1>
        <p className="text-slate-500 text-xs">Last updated: October 2026</p>
      </div>

      <p>
        Welcome to <strong>UP BOARD COCHING</strong>. By accessing our platform, YouTube lectures, or downloading notes and question papers, you agree to comply with and be bound by the following terms.
      </p>

      <h3 className="font-heading font-bold text-sm text-slate-900">1. Educational Fair Use</h3>
      <p>
        All handwritten notes, presentations, question banks, and video materials provided on this platform are intended solely for the non-commercial educational use of students preparing for UP Board examinations. Redistribution for paid commercial resale is prohibited.
      </p>

      <h3 className="font-heading font-bold text-sm text-slate-900">2. UPMSP Disclaimer</h3>
      <p>
        UP BOARD COCHING is an independent educational coaching and YouTube learning brand. It is NOT directly affiliated with the Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP Prayagraj). Official notifications, syllabus changes, and examination dates are verified from the official portal <code>upmsp.edu.in</code>.
      </p>

      <h3 className="font-heading font-bold text-sm text-slate-900">3. Student Conduct</h3>
      <p>
        Students participating in YouTube Live chats or submitting doubt forms are expected to maintain respectful, constructive, and academic communication at all times.
      </p>
    </div>
  );
};
