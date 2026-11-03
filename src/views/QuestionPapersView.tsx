/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  CheckCircle2,
  Bookmark,
  Eye,
  X,
  Filter,
  Calendar,
  Award,
  Layers,
} from 'lucide-react';
import { QuestionPaperItem, ClassLevel } from '../types';
import { storageService } from '../services/storageService';

interface QuestionPapersViewProps {
  papers: QuestionPaperItem[];
  bookmarkedPaperIds: string[];
  onToggleBookmark: (paperId: string) => void;
  currentUserFullName?: string;
  onOpenPdfViewer?: (doc: any) => void;
}

export const QuestionPapersView: React.FC<QuestionPapersViewProps> = ({
  papers,
  bookmarkedPaperIds,
  onToggleBookmark,
  currentUserFullName,
  onOpenPdfViewer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<'All' | ClassLevel>('All');
  const [yearFilter, setYearFilter] = useState<number | 'All'>('All');
  const [mediumFilter, setMediumFilter] = useState<'All' | 'Hindi' | 'English'>('All');
  const [selectedSolutionModal, setSelectedSolutionModal] = useState<QuestionPaperItem | null>(null);

  const filteredPapers = papers.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paperCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || p.classLevel === classFilter;
    const matchesYear = yearFilter === 'All' || p.year === yearFilter;
    const matchesMedium = mediumFilter === 'All' || p.medium === mediumFilter;
    return matchesSearch && matchesClass && matchesYear && matchesMedium;
  });

  const handleDownload = (paper: QuestionPaperItem, withSolution: boolean = false) => {
    const title = `${paper.title} ${withSolution ? '- Solved Answer Key' : '- Question Paper'}`;
    if (onOpenPdfViewer) {
      onOpenPdfViewer({
        ...paper,
        title,
        summary: `Official UPMSP ${paper.classLevel} ${paper.subject} Question Paper (Year ${paper.year}, Code: ${paper.paperCode}). Duration: ${paper.duration}, Max Marks: ${paper.maxMarks}.`,
        keyTopics: paper.solutionHighlights || ['All Questions with Step Marking Distribution'],
      });
    } else {
      storageService.downloadResource(title, 'pdf', {
        summary: `Official UPMSP ${paper.classLevel} ${paper.subject} Question Paper (Year ${paper.year}, Code: ${paper.paperCode}). Duration: ${paper.duration}, Max Marks: ${paper.maxMarks}.`,
        keyTopics: paper.solutionHighlights || ['All Questions with Step Marking Distribution'],
        studentName: currentUserFullName,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Previous 5 Years Question Papers (PYQ)
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight mt-1">
            UP Board Question Papers & Answer Keys
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Authentic UPMSP previous year board exam papers from 2022 to 2026, official model question papers, and verified evaluator marking solutions.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          Showing {filteredPapers.length} question papers
        </div>
      </div>

      {/* Search & Multi-Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by subject, code (e.g. 346(FW), 822(HV), Physics 2026, Model Paper)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
          {/* Class Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Class:
            </label>
            <div className="flex flex-wrap gap-1">
              {(['All', 'Class 12', 'Class 10', 'Class 11', 'Class 9'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setClassFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    classFilter === lvl
                      ? 'bg-indigo-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Exam Year:
            </label>
            <div className="flex flex-wrap gap-1">
              {['All', 2026, 2025, 2024, 2023, 2022].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setYearFilter(yr as any)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    yearFilter === yr
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Medium Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Medium:
            </label>
            <div className="flex flex-wrap gap-1">
              {(['All', 'Hindi', 'English'] as const).map((med) => (
                <button
                  key={med}
                  onClick={() => setMediumFilter(med)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    mediumFilter === med
                      ? 'bg-blue-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {med}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-heading font-bold text-base text-slate-900">
            No question papers found
          </h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query, class, or year filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setClassFilter('All');
              setYearFilter('All');
              setMediumFilter('All');
            }}
            className="px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => {
            const isBookmarked = bookmarkedPaperIds.includes(paper.id);
            return (
              <div
                key={paper.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-900">
                      {paper.paperType}
                    </span>
                    <button
                      onClick={() => onToggleBookmark(paper.id)}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-slate-400'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark Paper'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="text-indigo-700">{paper.classLevel}</span>
                      <span>·</span>
                      <span>{paper.subject}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-400">{paper.year}</span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900 mt-1 leading-snug">
                      {paper.title}
                    </h3>
                  </div>

                  {/* Details Card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Paper Set Code:</span>
                      <span className="font-mono font-bold text-slate-900">{paper.paperCode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Language / Medium:</span>
                      <span className="font-semibold text-slate-800">{paper.medium} Medium</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Marks & Time:</span>
                      <span>{paper.maxMarks} Marks ({paper.duration})</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-700 font-semibold pt-1">
                      <span>Solution Available:</span>
                      <span>✓ Yes (Verified)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => setSelectedSolutionModal(paper)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center transition-colors cursor-pointer"
                  >
                    View Solutions
                  </button>

                  <button
                    onClick={() => handleDownload(paper, false)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 transition-colors cursor-pointer"
                    title="Download Paper PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Solution Highlights Modal */}
      {selectedSolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto space-y-4 p-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                  {selectedSolutionModal.classLevel} · {selectedSolutionModal.paperCode}
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                  {selectedSolutionModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSolutionModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Official Marking Scheme Solutions prepared by senior UP Board evaluators.
                </span>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Key Solution Highlights Included:
                </p>
                <ul className="space-y-1.5">
                  {(selectedSolutionModal.solutionHighlights || [
                    'Section A: 20 OMR MCQs exact key with conceptual proof',
                    'Section B: Step-by-step marking distribution for 2, 4 and 6 mark questions',
                    'Proper diagrams with labeling rules for maximum presentation marks',
                  ]).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDownload(selectedSolutionModal, false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Download Question Paper
              </button>

              <button
                onClick={() => {
                  handleDownload(selectedSolutionModal, true);
                  setSelectedSolutionModal(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-semibold text-xs cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Solved Answer Key PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
