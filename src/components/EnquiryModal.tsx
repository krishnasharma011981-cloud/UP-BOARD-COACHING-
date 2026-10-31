/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, Phone, MessageCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { ClassLevel } from '../types';
import { storageService } from '../services/storageService';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClass?: ClassLevel;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultClass = 'Class 12',
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    mobile: '',
    email: '',
    classLevel: defaultClass,
    subject: 'Complete Board Exam Target Batch',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.studentName.trim()) {
      errs.studentName = 'Please enter student name';
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      errs.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (formData.email && !formData.email.includes('@')) {
      errs.email = 'Enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    storageService.submitEnquiry({
      studentName: formData.studentName,
      parentName: formData.parentName || undefined,
      mobile: formData.mobile,
      email: formData.email || undefined,
      classLevel: formData.classLevel,
      subject: formData.subject,
      message: formData.message || 'Admission inquiry for board batch',
    });

    setIsSuccess(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello UP BOARD COCHING! My name is ${formData.studentName || 'Student'}, looking for admission guidance for ${formData.classLevel}. Mobile: ${formData.mobile || 'Provided'}.`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Admission & Guidance Enquiry
              </h3>
              <p className="text-[11px] text-slate-300">
                Connect with our UP Board Senior Mentors
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-blue-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-xl text-slate-900">
              Enquiry Submitted Successfully!
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Thank you, <span className="font-semibold">{formData.studentName}</span>. Our UP Board counseling team will call or WhatsApp you within 2 business hours.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Student Name */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    errors.studentName ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-blue-600'
                  }`}
                />
                {errors.studentName && (
                  <p className="text-[10px] text-red-500">{errors.studentName}</p>
                )}
              </div>

              {/* Parent Name */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Parent / Guardian Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="e.g. Shri Suresh Kumar"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mobile */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="10 digit mobile number"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none ${
                    errors.mobile ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-blue-600'
                  }`}
                />
                {errors.mobile && (
                  <p className="text-[10px] text-red-500">{errors.mobile}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@gmail.com"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Class Level */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Select Class</label>
                <select
                  value={formData.classLevel}
                  onChange={(e) => setFormData({ ...formData, classLevel: e.target.value as ClassLevel })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs focus:border-blue-600 focus:outline-none cursor-pointer"
                >
                  <option value="Class 12">Class 12 (Intermediate)</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10 (High School)</option>
                  <option value="Class 9">Class 9</option>
                </select>
              </div>

              {/* Course or Subject */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Interested Subject / Course</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs focus:border-blue-600 focus:outline-none cursor-pointer"
                >
                  <option value="Complete Board Exam Target Batch">All Subjects Target 95%+ Batch</option>
                  <option value="Physics Special">Physics (भौतिक विज्ञान) Special</option>
                  <option value="Mathematics Special">Mathematics (गणित) Special</option>
                  <option value="Chemistry Special">Chemistry (रसायन विज्ञान) Special</option>
                  <option value="Science Complete">Class 10 Science & Math</option>
                  <option value="Hindi & English Grammar">Hindi & English Grammar</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Enquiry Message / Doubt</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your questions regarding batch timetable, notes, test series, or fees..."
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 text-xs focus:outline-none resize-none"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-500/50 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors font-semibold cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Query</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Enquiry</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
