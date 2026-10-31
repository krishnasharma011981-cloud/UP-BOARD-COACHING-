/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { ClassLevel, PageView } from '../types';
import { storageService } from '../services/storageService';

interface ExamCalendarViewProps {
  onNavigate: (page: PageView) => void;
}

export const ExamCalendarView: React.FC<ExamCalendarViewProps> = ({ onNavigate }) => {
  const [activeClassTab, setActiveClassTab] = useState<'Class 12' | 'Class 10'>('Class 12');

  const class12Schedule = [
    { date: '18 Feb 2027', day: 'Thursday', time: '02:00 PM - 05:15 PM', subject: 'Samanya Hindi / Sahityik Hindi (सामान्य हिंदी)', code: '101' },
    { date: '21 Feb 2027', day: 'Sunday', time: '02:00 PM - 05:15 PM', subject: 'General English (अंग्रेजी)', code: '117' },
    { date: '24 Feb 2027', day: 'Wednesday', time: '02:00 PM - 05:15 PM', subject: 'Physics (भौतिक विज्ञान)', code: '346' },
    { date: '27 Feb 2027', day: 'Saturday', time: '02:00 PM - 05:15 PM', subject: 'Chemistry (रसायन विज्ञान)', code: '347' },
    { date: '02 Mar 2027', day: 'Tuesday', time: '02:00 PM - 05:15 PM', subject: 'Mathematics / Biology (गणित / जीव विज्ञान)', code: '324 / 348' },
    { date: '05 Mar 2027', day: 'Friday', time: '02:00 PM - 05:15 PM', subject: 'Economics / Accountancy (अर्थशास्त्र / बहीखाता)', code: '212' },
  ];

  const class10Schedule = [
    { date: '18 Feb 2027', day: 'Thursday', time: '08:30 AM - 11:45 AM', subject: 'Hindi (हिंदी)', code: '801' },
    { date: '22 Feb 2027', day: 'Monday', time: '08:30 AM - 11:45 AM', subject: 'Mathematics (गणित)', code: '822' },
    { date: '25 Feb 2027', day: 'Thursday', time: '08:30 AM - 11:45 AM', subject: 'Science (विज्ञान)', code: '824' },
    { date: '28 Feb 2027', day: 'Sunday', time: '08:30 AM - 11:45 AM', subject: 'English (अंग्रेजी)', code: '817' },
    { date: '03 Mar 2027', day: 'Wednesday', time: '08:30 AM - 11:45 AM', subject: 'Social Science (सामाजिक विज्ञान)', code: '825' },
    { date: '06 Mar 2027', day: 'Saturday', time: '08:30 AM - 11:45 AM', subject: 'Drawing / Computer (चित्रकला / कम्प्यूटर)', code: '830' },
  ];

  const currentSchedule = activeClassTab === 'Class 12' ? class12Schedule : class10Schedule;

  const handleDownloadTimetable = () => {
    const content = currentSchedule.map(
      (item) => `[${item.date} (${item.day})] ${item.time} -> ${item.subject} (Code: ${item.code})`
    ).join('\n');

    storageService.downloadResource(`UP_Board_${activeClassTab}_Examination_Timetable_2027`, 'pdf', {
      summary: `Official examination time table and date sheet for UP Board ${activeClassTab} Annual Board Exams 2027.`,
      keyTopics: currentSchedule.map((c) => `${c.date}: ${c.subject}`),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            UPMSP Annual Board Exam Date Sheet 2027
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight mt-1">
            Examination Timetable & Academic Calendar
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Official day-wise examination schedule for High School (Class 10) and Intermediate (Class 12) board examinations.
          </p>
        </div>

        <button
          onClick={handleDownloadTimetable}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-800 text-white font-semibold text-xs shadow-md transition-colors shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print / Download Timetable PDF</span>
        </button>
      </div>

      {/* Class Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveClassTab('Class 12')}
          className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
            activeClassTab === 'Class 12'
              ? 'bg-blue-900 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Class 12 Intermediate (Evening Shift: 02:00 PM)
        </button>

        <button
          onClick={() => setActiveClassTab('Class 10')}
          className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
            activeClassTab === 'Class 10'
              ? 'bg-blue-900 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Class 10 High School (Morning Shift: 08:30 AM)
        </button>
      </div>

      {/* Date Sheet Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg">
              {activeClassTab} Annual Board Examination Timetable 2027
            </h3>
            <p className="text-xs text-slate-400">
              Reporting time: 30 minutes prior to exam commencement. Extra 15 minutes allotted for question paper reading.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded bg-amber-400 text-slate-950">
            Commencing 18 Feb 2027
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Date & Day</th>
                <th className="py-3.5 px-6">Examination Shift & Timing</th>
                <th className="py-3.5 px-6">Subject & Paper Title</th>
                <th className="py-3.5 px-6">Paper Code</th>
                <th className="py-3.5 px-6 text-right">Preparation Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentSchedule.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-heading font-bold text-slate-900 whitespace-nowrap">
                    <div>{row.date}</div>
                    <div className="text-[11px] font-normal text-slate-500">{row.day}</div>
                  </td>

                  <td className="py-4 px-6 font-mono text-slate-700 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {row.time}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-semibold text-slate-900 text-sm">
                    {row.subject}
                  </td>

                  <td className="py-4 px-6 font-mono font-bold text-slate-500">
                    {row.code}
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => onNavigate(activeClassTab === 'Class 12' ? 'class-12' : 'class-10')}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold text-xs cursor-pointer"
                    >
                      Study Notes & PYQ &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Exam & Key Milestones Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Phase 1 Practical Exams</span>
          </div>
          <h4 className="font-heading font-bold text-base text-slate-900">
            21 Jan 2027 - 05 Feb 2027
          </h4>
          <p className="text-xs text-slate-600">
            Agra, Saharanpur, Bareilly, Lucknow, Jhansi, Chitrakoot, Faizabad, Azamgarh, Devipatan and Basti divisions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Phase 2 Practical Exams</span>
          </div>
          <h4 className="font-heading font-bold text-base text-slate-900">
            06 Feb 2027 - 14 Feb 2027
          </h4>
          <p className="text-xs text-slate-600">
            Aligarh, Meerut, Moradabad, Kanpur, Prayagraj, Mirzapur, Varanasi and Gorakhpur divisions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Admit Card Distribution</span>
          </div>
          <h4 className="font-heading font-bold text-base text-slate-900">
            01 Feb 2027 Onwards
          </h4>
          <p className="text-xs text-slate-600">
            Available through respective school principals with principal signature & school seal.
          </p>
        </div>
      </div>

    </div>
  );
};
