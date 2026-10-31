/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Youtube,
  MessageCircle,
  Send,
  BookOpen,
  QrCode,
  X,
} from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  onOpenEnquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenEnquiry }) => {
  const [showTelegramQrModal, setShowTelegramQrModal] = useState(false);

  const navigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-20_at_18.13.43_64311f73.jpeg"
                alt="UP BOARD COACHING Logo"
                className="w-12 h-12 object-contain rounded-full border-2 border-amber-400 shadow-lg shrink-0"
              />
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  UP BOARD <span className="text-amber-400">COACHING</span>
                </span>
                <p className="text-xs text-slate-400 font-medium">Your Success, Our Mission</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Empowering UP Board students of Class 9, 10, 11 and 12 with free daily YouTube live classes,
              authentic NCERT solutions, handwritten topper notes, and 5-year previous papers with detailed Hindi explanations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@UPBoard_Coaching"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-all hover:scale-105 shadow-sm"
                title="YouTube (@UPBoard_Coaching)"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/917518177177"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all hover:scale-105 shadow-sm"
                title="WhatsApp Direct (7518177177)"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/NIOSHELPLINEAPRIL2027"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400 hover:bg-sky-600 hover:text-white transition-all hover:scale-105 shadow-sm"
                title="Telegram (@NIOSHELPLINEAPRIL2027)"
              >
                <Send className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={() => setShowTelegramQrModal(true)}
                className="px-2.5 py-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-sm"
                title="Scan Telegram QR Code (@NIOSHELPLINEAPRIL2027)"
              >
                <QrCode className="w-4 h-4" />
                <span className="text-[11px]">QR Scan</span>
              </button>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Classes & Syllabus
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('class-12')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Class 12 Intermediate (Board)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('class-11')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Class 11 Science & Arts
                </button>
              </li>
              <li>
                <button onClick={() => navigate('class-10')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Class 10 High School (Board)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('class-9')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Class 9 Foundation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('courses')} className="hover:text-amber-400 transition-colors cursor-pointer font-semibold text-blue-400">
                  View All Subjects &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Free Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('live-quiz')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer flex items-center gap-1.5">
                  <span>⚡ Live Quiz (50 Questions)</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('live-classes')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  YouTube Live Lectures
                </button>
              </li>
              <li>
                <button onClick={() => navigate('study-material')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Handwritten Notes & PPTs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('previous-year-papers')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  5 Years Question Papers (PYQ)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('notifications')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  UPMSP Date Sheet & Circulars
                </button>
              </li>
              <li>
                <button onClick={() => navigate('exam-calendar')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  2027 Board Exam Calendar
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Study Center Column with Updated Numbers and Email */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Contact & Center
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Civil Lines, Prayagraj (Allahabad), Uttar Pradesh - 211001</span>
              </div>
              
              {/* Phone Numbers: 7518177177, 7518786238 */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href="tel:7518177177" className="hover:text-white font-medium text-slate-200 transition-colors">
                    +91 7518177177
                  </a>
                  <span className="text-slate-500">/</span>
                  <a href="tel:7518786238" className="hover:text-white font-medium text-slate-200 transition-colors">
                    +91 7518786238
                  </a>
                </div>
              </div>

              {/* Support Email: ASHISHPANDEYTUTORIALS@GMAIL.COM */}
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a
                  href="mailto:ASHISHPANDEYTUTORIALS@GMAIL.COM"
                  className="hover:text-white text-slate-200 font-medium break-all transition-colors"
                >
                  ASHISHPANDEYTUTORIALS@GMAIL.COM
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenEnquiry}
                  className="w-full py-2 px-3 rounded-lg bg-blue-900/80 border border-blue-700/60 hover:bg-blue-800 text-white font-medium text-xs text-center transition-colors cursor-pointer"
                >
                  Send Admission Enquiry
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} UP BOARD COACHING. Dedicated to Uttar Pradesh students.
          </p>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('about')} className="hover:text-slate-300 transition-colors cursor-pointer">
              About Us
            </button>
            <button onClick={() => navigate('faq')} className="hover:text-slate-300 transition-colors cursor-pointer">
              FAQs
            </button>
            <button onClick={() => navigate('privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => navigate('terms')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <a
              href="https://upmsp.edu.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-amber-400/80 hover:text-amber-300 transition-colors"
            >
              <span>UPMSP Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Telegram Channel QR Code Modal */}
      {showTelegramQrModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowTelegramQrModal(false)}
        >
          <div
            className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTelegramQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close QR Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
              <Send className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                Join Telegram Community
              </h3>
              <p className="text-xs text-slate-500">
                Scan the QR code or click below to join the official channel for live updates, notes, and exam circulars.
              </p>
            </div>

            {/* Official QR Code Image from uploaded 2nd asset */}
            <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex flex-col items-center justify-center shadow-inner">
              <img
                src="/assets/aistudio/image_a5bc4b71.png"
                alt="UP BOARD COACHING Telegram QR Code @NIOSHELPLINEAPRIL2027"
                className="w-56 h-auto max-h-64 object-contain rounded-xl shadow-xs"
              />
              <p className="mt-2 text-xs font-mono font-bold text-purple-900 tracking-wide">
                @NIOSHELPLINEAPRIL2027
              </p>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <a
                href="https://t.me/NIOSHELPLINEAPRIL2027"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Open in Telegram App / Web &rarr;</span>
              </a>
              <button
                onClick={() => setShowTelegramQrModal(false)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
