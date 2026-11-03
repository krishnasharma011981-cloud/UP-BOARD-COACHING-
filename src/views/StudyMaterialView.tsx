/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Download,
  FileText,
  Presentation,
  Filter,
  CheckCircle2,
  Bookmark,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import { StudyMaterialItem, ClassLevel } from '../types';
import { storageService } from '../services/storageService';

interface StudyMaterialViewProps {
  materials: StudyMaterialItem[];
  savedMaterialIds: string[];
  onToggleBookmark: (materialId: string) => void;
  currentUserFullName?: string;
  onOpenPdfViewer?: (doc: any) => void;
}

export const StudyMaterialView: React.FC<StudyMaterialViewProps> = ({
  materials,
  savedMaterialIds,
  onToggleBookmark,
  currentUserFullName,
  onOpenPdfViewer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<'All' | ClassLevel>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'notes' | 'ppt' | 'formula_sheet' | 'important_qa'>('All');
  const [previewItem, setPreviewItem] = useState<StudyMaterialItem | null>(null);

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || m.classLevel === classFilter;
    const matchesType = typeFilter === 'All' || m.type === typeFilter;
    return matchesSearch && matchesClass && matchesType;
  });

  const handleDownload = (item: StudyMaterialItem) => {
    if (onOpenPdfViewer) {
      onOpenPdfViewer(item);
    } else {
      storageService.downloadResource(item.title, item.type === 'ppt' ? 'ppt' : 'pdf', {
        summary: item.summary,
        keyTopics: item.keyTopics,
        studentName: currentUserFullName,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Free Educational Resources
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight mt-1">
            UP Board Study Material, Notes & PPTs
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Download topper handwritten notes, PowerPoint presentations, formula cheat sheets, and NCERT solutions for Class 9, 10, 11 & 12.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          Showing {filteredMaterials.length} of {materials.length} resources
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by chapter, subject (e.g. Physics, Electrostatics, Trigonometry, रस-छन्द)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-700"
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

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-slate-500 font-medium mr-1">Class:</span>
            {(['All', 'Class 12', 'Class 11', 'Class 10', 'Class 9'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setClassFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  classFilter === lvl
                    ? 'bg-blue-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-slate-500 font-medium mr-1">Type:</span>
            {[
              { id: 'All', label: 'All Files' },
              { id: 'notes', label: 'Handwritten Notes' },
              { id: 'ppt', label: 'PPT Slides' },
              { id: 'formula_sheet', label: 'Formula Sheets' },
              { id: 'important_qa', label: 'Important Q&A' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  typeFilter === t.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-heading font-bold text-base text-slate-900">
            No study materials matched your search
          </h3>
          <p className="text-xs text-slate-500">
            Try resetting your search query or class filter to view all available notes.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setClassFilter('All');
              setTypeFilter('All');
            }}
            className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => {
            const isSaved = savedMaterialIds.includes(mat.id);
            return (
              <div
                key={mat.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded bg-blue-50 text-blue-900">
                      {mat.type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => onToggleBookmark(mat.id)}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                        isSaved ? 'text-amber-500' : 'text-slate-400'
                      }`}
                      title={isSaved ? 'Saved in Portal' : 'Save in Student Portal'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-blue-700">
                      {mat.classLevel} · {mat.subject}
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 mt-0.5 line-clamp-2">
                      {mat.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {mat.summary}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Key Highlights:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {mat.keyTopics.slice(0, 3).map((top, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] truncate max-w-[200px]"
                        >
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {mat.fileSize} · {mat.pageCount} pgs
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => (onOpenPdfViewer ? onOpenPdfViewer(mat) : setPreviewItem(mat))}
                      className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                      title="View PDF Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDownload(mat)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto space-y-4 p-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  {previewItem.classLevel} · {previewItem.subject}
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                  {previewItem.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">
                {previewItem.summary}
              </p>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Topics & Derivations Inside:
                </p>
                <ul className="space-y-1">
                  {previewItem.keyTopics.map((top, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{top}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {previewItem.sampleQuestions && previewItem.sampleQuestions.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Board Sample Question Included:
                  </p>
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
                    <p className="font-semibold text-blue-950">
                      {previewItem.sampleQuestions[0].q}
                    </p>
                    <p className="text-slate-600 mt-1">
                      Answer: {previewItem.sampleQuestions[0].a}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                {previewItem.pageCount} Pages · {previewItem.fileSize}
              </span>

              <button
                onClick={() => {
                  handleDownload(previewItem);
                  setPreviewItem(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Complete Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
