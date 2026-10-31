/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageCircle, X, Send, HelpCircle, GraduationCap } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Admission & Batch Enquiry');


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* WhatsApp Chat Popup Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-90 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-20_at_18.13.43_64311f73.jpeg"
                alt="UP BOARD COACHING Logo"
                className="w-10 h-10 object-contain rounded-full border border-amber-300 shadow-md shrink-0"
              />
              <div>
                <p className="font-heading font-bold text-sm">UP BOARD COACHING</p>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Online Support: 7518177177
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 shadow-2xs">
              <p className="font-semibold text-slate-900 mb-1">
                🙏 नमस्ते प्रिय छात्र / अभिभावक!
              </p>
              <p>
                How can our senior teachers help you with your UP Board Class 9, 10, 11 & 12 preparation today?
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Select Your Doubt / Requirement:
              </label>
              {[
                'Admission & Batch Enquiry',
                'Class 10 Board Exam Notes & OMR',
                'Class 12 Physics & Chemistry Numerical Doubt',
                'Previous Year Question Papers PDF',
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                    selectedTopic === topic
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            <a
              href={`https://wa.me/917518177177?text=${encodeURIComponent(
                `Namaste UP BOARD COACHING! I need help with: "${selectedTopic}".`
              )}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Chat on WhatsApp (7518177177)</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Contact support on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="hidden sm:inline-block font-semibold text-xs tracking-wide">
          Ask Doubt on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
        </span>
      </button>
    </div>
  );
};
