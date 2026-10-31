/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Users,
  Send,
  FileText,
  Presentation,
  Share2,
  CheckCircle,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { LiveClassItem } from '../types';
import { storageService } from '../services/storageService';

interface LivePlayerModalProps {
  liveClass: LiveClassItem | null;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  district: string;
  text: string;
  time: string;
  isTeacher?: boolean;
}

const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'c1',
    sender: 'Er. Rakesh Sharma (Teacher)',
    district: 'Host',
    text: 'Welcome all UP Board students! Today we are solving Gauss Theorem derivations & top 15 numericals.',
    time: '19:30',
    isTeacher: true,
  },
  {
    id: 'c2',
    sender: 'Rohan Tiwari',
    district: 'Gorakhpur',
    text: 'Sir, dielectric constant K aane par electric flux kaise change hoga?',
    time: '19:32',
  },
  {
    id: 'c3',
    sender: 'Kajal Vishwakarma',
    district: 'Varanasi',
    text: 'Notes ki PDF download ho gayi sir, handwritten steps are super clear!',
    time: '19:34',
  },
  {
    id: 'c4',
    sender: 'Abhishek Maurya',
    district: 'Prayagraj',
    text: 'Sir, kya Gauss Law non-uniform electric field me bhi valid hota h?',
    time: '19:35',
  },
  {
    id: 'c5',
    sender: 'Er. Rakesh Sharma (Teacher)',
    district: 'Host',
    text: '@Abhishek Yes, Gauss Law is always valid for any closed surface regardless of charge shape, but symmetry makes calculations simple!',
    time: '19:36',
    isTeacher: true,
  },
];

export const LivePlayerModal: React.FC<LivePlayerModalProps> = ({ liveClass, onClose }) => {
  if (!liveClass) return null;

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHATS);
  const [inputMsg, setInputMsg] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [simulatedViewers, setSimulatedViewers] = useState(liveClass.viewersCount || 2450);

  // Periodic simulated live viewer fluctuations
  useEffect(() => {
    if (!liveClass.isLiveNow) return;
    const timer = setInterval(() => {
      setSimulatedViewers((prev) => prev + Math.floor(Math.random() * 9) - 4);
    }, 4000);
    return () => clearInterval(timer);
  }, [liveClass.isLiveNow]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: 'c-' + Date.now(),
      sender: 'You (Student)',
      district: 'UP Board Aspirant',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Teacher simulated instant response after 3 seconds
    if (inputMsg.toLowerCase().includes('pdf') || inputMsg.toLowerCase().includes('notes')) {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'c-' + Date.now(),
            sender: `${liveClass.teacherName} (Teacher)`,
            district: 'Host',
            text: 'You can click the "Download Class Notes PDF" button right below this player to get the file instantly!',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            isTeacher: true,
          },
        ]);
      }, 2500);
    }
  };

  const handleDownload = (type: 'notes' | 'ppt' | 'formula') => {
    const title = `${liveClass.title} - ${type.toUpperCase()}`;
    storageService.downloadResource(title, type === 'ppt' ? 'ppt' : 'pdf', {
      summary: liveClass.description,
      keyTopics: [liveClass.chapterTopic, 'Step-by-step Formulas & Derivations', 'Teacher Solved Numerical Examples'],
    });
    setDownloadSuccess(type);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: liveClass.title,
        text: `Watch UP Board Live Class: ${liveClass.title} on UP BOARD COCHING!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Live class link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            {liveClass.isLiveNow ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600 text-white text-[11px] font-bold tracking-wider uppercase shrink-0">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                LIVE NOW
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold shrink-0">
                {liveClass.isCompleted ? 'RECORDED LECTURE' : 'UPCOMING CLASS'}
              </span>
            )}
            <h3 className="text-white text-sm sm:text-base font-heading font-bold truncate">
              {liveClass.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Share Class"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Stage & Chat Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden min-h-[480px]">
          
          {/* Left: 2 Columns Video Player & Downloads */}
          <div className="lg:col-span-2 flex flex-col bg-black overflow-y-auto">
            {/* Embedded Responsive YouTube Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${liveClass.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title={liveClass.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Class Info and Resource Downloads Bar */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-amber-400">{liveClass.classLevel}</span>
                    <span>·</span>
                    <span>{liveClass.subject}</span>
                    <span>·</span>
                    <span>Teacher: {liveClass.teacherName}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-heading font-bold text-white">
                    {liveClass.titleHindi}
                  </h2>
                </div>

                {liveClass.isLiveNow && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold shrink-0">
                    <Users className="w-4 h-4" />
                    <span>{simulatedViewers.toLocaleString('en-IN')} watching now</span>
                  </div>
                )}
              </div>

              {/* Downloadable Resources Bar */}
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Download Accompanying Class Study Resources:</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleDownload('notes')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-100 text-xs font-medium border border-blue-700/50 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-300" />
                    <span>{downloadSuccess === 'notes' ? 'Downloaded!' : 'Class PDF Notes'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload('ppt')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-100 text-xs font-medium border border-amber-700/50 transition-colors cursor-pointer"
                  >
                    <Presentation className="w-3.5 h-3.5 text-amber-400" />
                    <span>{downloadSuccess === 'ppt' ? 'Downloaded!' : 'Teacher PPT Slides'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload('formula')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-100 text-xs font-medium border border-emerald-700/50 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{downloadSuccess === 'formula' ? 'Downloaded!' : 'Formula Sheet'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {liveClass.description}
              </p>
            </div>
          </div>

          {/* Right: Live Interactive Student Chat */}
          <div className="lg:col-span-1 bg-slate-950 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800">
            {/* Chat Header */}
            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Live Student Q&A Chat</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">● Connected</span>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[220px] max-h-[380px] lg:max-h-[460px]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs space-y-1 ${
                    msg.isTeacher
                      ? 'bg-amber-400/10 border border-amber-400/30'
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        msg.isTeacher ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      {msg.sender}
                    </span>
                    <span className="text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask teacher doubt in Hindi or English..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
