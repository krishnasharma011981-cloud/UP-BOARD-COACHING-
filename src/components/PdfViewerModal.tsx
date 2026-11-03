/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  Sparkles,
  Maximize2,
  BookOpen,
  Award,
} from 'lucide-react';
import { StudyMaterialItem, QuestionPaperItem } from '../types';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    title: string;
    classLevel?: string;
    subject?: string;
    type?: string;
    year?: number;
    paperCode?: string;
    summary?: string;
    keyTopics?: string[];
    sampleQuestions?: Array<{ q: string; a: string; marks: number }>;
    pageCount?: number;
  } | null;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const totalPages = doc?.pageCount || 3;

  if (!isOpen || !doc) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Generate authentic printable HTML PDF document blob
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.title} - UP BOARD COACHING</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Mukta', 'Segoe UI', Arial, sans-serif; color: #0f172a; line-height: 1.5; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 20px; }
    .title { font-size: 20pt; font-weight: bold; color: #1e3a8a; margin: 0; }
    .subtitle { font-size: 11pt; color: #475569; margin-top: 4px; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 10pt; }
    .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f8fafc; }
    .box-title { font-weight: bold; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; font-size: 12pt; }
    .q-item { margin-bottom: 12px; padding: 10px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; }
    .marks { float: right; font-weight: bold; color: #dc2626; font-size: 10pt; }
    .footer { text-align: center; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 9pt; color: #64748b; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">UTTAR PRADESH MADHYAMIK SHIKSHA PARISHAD (UPMSP)</div>
    <h1 class="title">${doc.title}</h1>
    <div class="subtitle">${doc.classLevel || 'Class 12'} · ${doc.subject || 'All Subjects'} ${doc.paperCode ? `· Paper Code: ${doc.paperCode}` : ''}</div>
  </div>

  <div class="box">
    <div class="box-title">📘 CHAPTER SUMMARY & KEY HIGHLIGHTS</div>
    <p>${doc.summary || 'Detailed official NCERT based notes and step derivations prepared by senior UP Board faculty.'}</p>
    ${
      doc.keyTopics && doc.keyTopics.length > 0
        ? `<div><strong>Key Topics Covered:</strong><ul>${doc.keyTopics.map((t) => `<li>${t}</li>`).join('')}</ul></div>`
        : ''
    }
  </div>

  <div class="box">
    <div class="box-title">📝 IMPORTANT BOARD QUESTIONS & MODEL SOLUTIONS</div>
    <div class="q-item">
      <span class="marks">[5 Marks]</span>
      <strong>Q1. Derive the mathematical formulation with neat labeled diagram.</strong>
      <p style="margin-top: 6px; color: #334155;"><em>Solution:</em> According to Gauss's Theorem / Coulomb's Law, the total electric flux linked with a closed surface is equal to 1/ε₀ times the total charge enclosed.</p>
    </div>
    <div class="q-item">
      <span class="marks">[3 Marks]</span>
      <strong>Q2. Explain the fundamental principles and define SI units.</strong>
      <p style="margin-top: 6px; color: #334155;"><em>Solution:</em> State the standard definitions with clear SI units (N/C, V/m) and mention temperature dependency factors.</p>
    </div>
  </div>

  <div class="footer">
    UP BOARD COACHING • Website: https://upboardcoaching.netlify.app • YouTube: @UPBoard_Coaching • All Rights Reserved
  </div>
</body>
</html>
    `.trim();

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    const cleanName = doc.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 35);
    a.download = `UP_BOARD_${cleanName}.html`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top PDF Toolbar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-white flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-white truncate max-w-xs sm:max-w-md">
                {doc.title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {doc.classLevel || 'UP Board'} · {doc.subject || 'All Subjects'} {doc.paperCode ? `(${doc.paperCode})` : ''} • PDF Visual Document Viewer
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Page Navigator */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono px-2 text-[11px] text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1 rounded hover:bg-slate-800 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 text-slate-300">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 rounded hover:bg-slate-800 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Print</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Reader Canvas Stage */}
        <div className="flex-1 bg-slate-950/90 overflow-y-auto p-4 sm:p-8 flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 border border-slate-200 transition-transform duration-150 space-y-6"
          >
            {/* Page Header (Official Look) */}
            <div className="border-b-2 border-blue-950 pb-4 text-center space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">
                <span>UPMSP Prayagraj Board • 2027 Syllabus</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-blue-950 pt-2">
                UP BOARD COACHING — OFFICIAL STUDY RESOURCE
              </h1>
              <p className="text-xs font-semibold text-red-600">
                {doc.classLevel || 'Class 12'} · {doc.subject || 'Core Subject'} {doc.paperCode ? `· Paper Code: ${doc.paperCode}` : ''}
              </p>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 mt-2">
                {doc.title}
              </h2>
            </div>

            {/* Page 1: Chapter Theory & Visual Diagram Notes */}
            {currentPage === 1 && (
              <div className="space-y-5 text-xs sm:text-sm text-slate-800">
                <div className="p-4 rounded-xl bg-amber-50/70 border-l-4 border-amber-500 space-y-2">
                  <h4 className="font-heading font-bold text-sm text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Important Board Concept & Master Formulae (महत्वपूर्ण सूत्र एवं अवधारणा)</span>
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {doc.summary ||
                      'This official chapter module includes all high-probability derivations, step-by-step marking rubrics, and solved NCERT board questions.'}
                  </p>
                </div>

                {doc.keyTopics && doc.keyTopics.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-600">
                      Key Topics & Derivations Covered:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {doc.keyTopics.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-medium text-slate-700">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Handwritten visual representation */}
                <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3 font-serif">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2 font-sans text-xs font-bold text-blue-900">
                    <span>📌 Board Exam Answer Writing Technique</span>
                    <span className="text-[11px] text-red-600 font-mono">Max Marks: 70</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">
                    <strong>Rule 1:</strong> Always start definitions with the standard SI units. E.g., Electric Field Intensity: <code>E = F / q [N/C]</code>.
                  </p>
                  <p className="text-xs leading-relaxed text-slate-700">
                    <strong>Rule 2:</strong> In physics/chemistry diagrams, draw clear arrows showing the direction of electric flux / reaction coordinate.
                  </p>
                </div>
              </div>
            )}

            {/* Page 2: Solved Model Questions & Detailed Step Derivations */}
            {currentPage === 2 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-heading font-bold text-base text-blue-950">
                    Section B: Long Answer & Derivations (दीर्घ उत्तरीय प्रश्न)
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    Board Solved Paper
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      Q1. State Gauss's Theorem in Electrostatics. Derive the electric field due to an infinitely long straight wire.
                    </span>
                    <span className="text-xs font-bold text-red-600 whitespace-nowrap">[5 Marks]</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 text-slate-700 border-l-2 border-blue-600">
                    <p className="font-semibold text-blue-900">Step 1: Statement of Gauss's Law</p>
                    <p className="font-mono text-slate-600">∮ E · dA = q_enclosed / ε₀</p>
                    <p className="font-semibold text-blue-900 pt-1">Step 2: Cylindrical Gaussian Surface</p>
                    <p className="text-slate-600">E · (2πrL) = λL / ε₀ ➔ E = λ / (2πε₀r)</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      Q2. What is Coulomb's Inverse Square Law? State its vector form and limitation.
                    </span>
                    <span className="text-xs font-bold text-red-600 whitespace-nowrap">[3 Marks]</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-700 border-l-2 border-emerald-600">
                    <p className="font-mono text-slate-600">F = (1 / 4πε₀) * (q₁q₂ / r²)</p>
                    <p className="text-slate-600">Valid only for point charges at rest.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Page 3: Important Formulas Sheet & Topper Tips */}
            {currentPage === 3 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                  <h4 className="font-heading font-bold text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>Topper Verified Revision Formula Sheet (सम्पूर्ण फॉर्मूला शीट)</span>
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Revise these critical equations 1 hour before entering the UP Board examination center:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-blue-900 font-sans block mb-1">Capacitance:</span>
                    C = ε₀A / d (Parallel Plate)
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-blue-900 font-sans block mb-1">Energy Stored:</span>
                    U = ½ CV² = ½ Q²/C
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-blue-900 font-sans block mb-1">Drift Velocity:</span>
                    v_d = eEτ / m
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-blue-900 font-sans block mb-1">Ohm's Vector Law:</span>
                    J = σE
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <p className="font-bold text-xs text-slate-800">
                    Free Video Lectures & Step-by-Step Derivations available on YouTube:
                  </p>
                  <p className="text-xs text-blue-700 font-semibold font-mono">
                    youtube.com/@UPBoard_Coaching
                  </p>
                </div>
              </div>
            )}

            {/* Page Footer */}
            <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 font-medium">
              UP BOARD COACHING • All Rights Reserved • Free Distribution for UPMSP Students
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
