/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Video,
  FileText,
  Bell,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Eye,
  AlertTriangle,
  Send,
  MessageSquare,
  BarChart3,
  Calendar,
  Lock,
  Radio,
  Download,
} from 'lucide-react';
import {
  LiveClassItem,
  StudyMaterialItem,
  QuestionPaperItem,
  UpNotificationItem,
  EnquiryItem,
  AdminSettings,
  ClassLevel,
  StudentNotificationItem,
} from '../types';
import { storageService } from '../services/storageService';

interface AdminDashboardViewProps {
  liveClasses: LiveClassItem[];
  studyMaterials: StudyMaterialItem[];
  questionPapers: QuestionPaperItem[];
  notifications: UpNotificationItem[];
  enquiries: EnquiryItem[];
  adminSettings: AdminSettings;
  onRefreshData: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  liveClasses,
  studyMaterials,
  questionPapers,
  notifications,
  enquiries,
  adminSettings,
  onRefreshData,
}) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true); // default true for preview convenience with PIN option
  const [activeTab, setActiveTab] = useState<'analytics' | 'live' | 'materials' | 'notifications' | 'enquiries' | 'settings'>('analytics');

  // New Live Class form state
  const [showAddLiveModal, setShowAddLiveModal] = useState(false);
  const [newLiveTitle, setNewLiveTitle] = useState('');
  const [newLiveClass, setNewLiveClass] = useState<ClassLevel>('Class 12');
  const [newLiveSubject, setNewLiveSubject] = useState('Physics');
  const [newLiveTeacher, setNewLiveTeacher] = useState('Er. Rakesh Sharma');
  const [newLiveVideoId, setNewLiveVideoId] = useState('jfKfPfyJRdk');
  const [newLiveDate, setNewLiveDate] = useState('Today');
  const [newLiveTime, setNewLiveTime] = useState('08:00 PM IST');
  const [newLiveDesc, setNewLiveDesc] = useState('');

  // New Study Material form state
  const [showAddMatModal, setShowAddMatModal] = useState(false);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatClass, setNewMatClass] = useState<ClassLevel>('Class 12');
  const [newMatSubject, setNewMatSubject] = useState('Physics');
  const [newMatType, setNewMatType] = useState<'notes' | 'ppt' | 'formula_sheet' | 'important_qa'>('notes');
  const [newMatChapter, setNewMatChapter] = useState(1);
  const [newMatChapterTitle, setNewMatChapterTitle] = useState('');
  const [newMatSummary, setNewMatSummary] = useState('');

  // New Notification form state
  const [showAddNotifModal, setShowAddNotifModal] = useState(false);
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifTitleHindi, setNewNotifTitleHindi] = useState('');
  const [newNotifCategory, setNewNotifCategory] = useState<'Time Table' | 'Admit Card' | 'Practical Exams' | 'Syllabus' | 'Result' | 'Model Paper'>('Time Table');
  const [newNotifClass, setNewNotifClass] = useState<'All Classes' | 'Class 10 & 12' | 'Class 10' | 'Class 12'>('Class 10 & 12');
  const [newNotifDesc, setNewNotifDesc] = useState('');
  const [newNotifIsUrgent, setNewNotifIsUrgent] = useState(false);

  // Push Broadcast message
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastClass, setBroadcastClass] = useState<'All' | ClassLevel>('All');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Settings form
  const [channelId, setChannelId] = useState(adminSettings.youtubeChannelId);
  const [channelHandle, setChannelHandle] = useState(adminSettings.youtubeChannelHandle);
  const [bannerText, setBannerText] = useState(adminSettings.emergencyBannerText);
  const [examDate, setExamDate] = useState(adminSettings.examDateIso.split('T')[0]);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleAddLiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiveTitle.trim()) return;

    const newItem: LiveClassItem = {
      id: 'live-' + Date.now(),
      title: newLiveTitle.trim(),
      titleHindi: newLiveTitle.trim(),
      subject: newLiveSubject,
      classLevel: newLiveClass,
      teacherName: newLiveTeacher,
      teacherRole: 'Senior Faculty',
      date: newLiveDate,
      time: newLiveTime,
      scheduledDateTime: new Date().toISOString(),
      durationMinutes: 90,
      isLiveNow: true,
      isCompleted: false,
      youtubeVideoId: newLiveVideoId.trim() || 'jfKfPfyJRdk',
      viewersCount: 1500,
      description: newLiveDesc || 'Live lecture for UP Board students.',
      chapterTopic: `${newLiveSubject} Board Revision`,
    };

    storageService.addLiveClass(newItem);
    setShowAddLiveModal(false);
    onRefreshData();
  };

  const handleAddMatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;

    const newMat: StudyMaterialItem = {
      id: 'mat-' + Date.now(),
      title: newMatTitle.trim(),
      titleHindi: newMatTitle.trim(),
      classLevel: newMatClass,
      subject: newMatSubject,
      chapterNumber: newMatChapter,
      chapterTitle: newMatChapterTitle || 'Board Chapter',
      type: newMatType,
      fileSize: '3.4 MB',
      pageCount: 22,
      downloadsCount: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      summary: newMatSummary || 'Uploaded notes for UP Board examination.',
      keyTopics: ['NCERT Theory', 'Important Formulas', 'Board Questions'],
    };

    storageService.addStudyMaterial(newMat);
    setShowAddMatModal(false);
    onRefreshData();
  };

  const handleAddNotifSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim()) return;

    const newNotif: UpNotificationItem = {
      id: 'notif-' + Date.now(),
      title: newNotifTitle.trim(),
      titleHindi: newNotifTitleHindi || newNotifTitle.trim(),
      publishDate: new Date().toISOString().split('T')[0],
      category: newNotifCategory,
      description: newNotifDesc,
      isUrgent: newNotifIsUrgent,
      officialSourceUrl: 'https://upmsp.edu.in',
      relevantClass: newNotifClass,
      pdfDownloadAvailable: true,
    };

    storageService.addNotification(newNotif);
    setShowAddNotifModal(false);
    onRefreshData();
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    storageService.pushStudentNotification({
      id: 'bn-' + Date.now(),
      title: broadcastTitle,
      message: broadcastMsg,
      timestamp: 'Just now',
      classLevel: broadcastClass,
      type: 'urgent',
      read: false,
      actionUrl: 'live-classes',
    });

    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSent(false), 3000);
    onRefreshData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveAdminSettings({
      ...adminSettings,
      youtubeChannelId: channelId,
      youtubeChannelHandle: channelHandle,
      emergencyBannerText: bannerText,
      examDateIso: `${examDate}T08:30:00.000Z`,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                UP BOARD COCHING — Admin Console
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                Active Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage YouTube live classes, notes repository, UPMSP notices, student inquiries, and live banner alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddLiveModal(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Go Live / Add Stream</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'analytics', label: 'Dashboard & Analytics', icon: BarChart3 },
          { id: 'live', label: `Live Classes (${liveClasses.length})`, icon: Video },
          { id: 'materials', label: `Study Materials (${studyMaterials.length})`, icon: FileText },
          { id: 'notifications', label: `UPMSP Notices (${notifications.length})`, icon: Bell },
          { id: 'enquiries', label: `Student Enquiries (${enquiries.length})`, icon: MessageSquare },
          { id: 'settings', label: 'YouTube & Platform Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Total Registered Students</span>
              <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1 tabular-nums">
                45,820
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">+340 enrolled today</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Active Live Viewers</span>
              <p className="font-heading font-extrabold text-2xl sm:text-3xl text-red-600 mt-1 tabular-nums">
                2,840
              </p>
              <span className="text-[11px] text-slate-400">Class 12 Physics Stream</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Total Notes & PPT Downloads</span>
              <p className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-900 mt-1 tabular-nums">
                194,500
              </p>
              <span className="text-[11px] text-blue-600 font-semibold">Across all 4 classes</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Pending Enquiries</span>
              <p className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-500 mt-1 tabular-nums">
                {enquiries.filter((e) => e.status === 'New').length}
              </p>
              <span className="text-[11px] text-slate-500">Require callback</span>
            </div>
          </div>

          {/* Broadcast Student Notification Push Widget */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-900" />
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Push Urgent Notification to Student Portals
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Broadcast an immediate alert banner and sound notification to all logged-in students or a specific class.
            </p>

            {broadcastSent && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                ✓ Notification broadcast dispatched to student bell center!
              </div>
            )}

            <form onSubmit={handleBroadcast} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="md:col-span-1">
                <label className="font-semibold text-slate-700 block mb-1">Target Class</label>
                <select
                  value={broadcastClass}
                  onChange={(e) => setBroadcastClass(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="All">All Classes (9 - 12)</option>
                  <option value="Class 12">Class 12 Only</option>
                  <option value="Class 10">Class 10 Only</option>
                  <option value="Class 11">Class 11 Only</option>
                  <option value="Class 9">Class 9 Only</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="font-semibold text-slate-700 block mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. 🚨 Chemistry Marathon Starting Now"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="md:col-span-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="font-semibold text-slate-700 block mb-1">Message Description</label>
                  <input
                    type="text"
                    required
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="Join the stream and download accompanying PDF notes..."
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl shrink-0 cursor-pointer"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE CLASSES MANAGER */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Manage Live Class Schedules & Streams
            </h3>
            <button
              onClick={() => setShowAddLiveModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Live Class</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4">Class & Subject</th>
                  <th className="py-3 px-4">Session Title</th>
                  <th className="py-3 px-4">Teacher</th>
                  <th className="py-3 px-4">Timing</th>
                  <th className="py-3 px-4">Stream Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liveClasses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-semibold text-blue-900 whitespace-nowrap">
                      {item.classLevel} · {item.subject}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {item.teacherName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono">
                      {item.date} {item.time}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          storageService.toggleLiveStatus(item.id);
                          onRefreshData();
                        }}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer ${
                          item.isLiveNow
                            ? 'bg-red-600 text-white'
                            : item.isCompleted
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.isLiveNow ? '● LIVE (Click to Stop)' : item.isCompleted ? 'Recorded' : 'Upcoming (Click to Live)'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          storageService.deleteLiveClass(item.id);
                          onRefreshData();
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STUDY MATERIALS MANAGER */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Manage Study Materials, PPTs & Notes
            </h3>
            <button
              onClick={() => setShowAddMatModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Material / PPT</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studyMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-semibold text-blue-900 whitespace-nowrap">
                      {mat.classLevel}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {mat.subject}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold">
                        {mat.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-sm truncate">
                      {mat.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {mat.downloadsCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          storageService.deleteStudyMaterial(mat.id);
                          onRefreshData();
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: UPMSP NOTIFICATIONS MANAGER */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Manage UPMSP Official Announcements
            </h3>
            <button
              onClick={() => setShowAddNotifModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Official Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {n.isUrgent && (
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                        URGENT
                      </span>
                    )}
                    <span className="font-semibold text-blue-900">{n.category}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{n.relevantClass}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400 font-mono">{n.publishDate}</span>
                  </div>
                  <h4 className="font-heading font-bold text-slate-900 text-sm">
                    {n.title}
                  </h4>
                </div>

                <button
                  onClick={() => {
                    storageService.deleteNotification(n.id);
                    onRefreshData();
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Student Admission & Guidance Inquiries
            </h3>
            <span className="text-xs text-slate-500">{enquiries.length} total enquiries</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Mobile (WhatsApp)</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Interested Subject</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Direct Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div>{enq.studentName}</div>
                      {enq.parentName && (
                        <div className="text-[10px] text-slate-400 font-normal">P: {enq.parentName}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {enq.mobile}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {enq.classLevel}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {enq.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {enq.message}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={enq.status}
                        onChange={(e) => {
                          storageService.updateEnquiryStatus(enq.id, e.target.value as any);
                          onRefreshData();
                        }}
                        className={`p-1 rounded text-[11px] font-bold ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-900'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <a
                        href={`https://wa.me/91${enq.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.studentName)},%20this%20is%20regarding%20your%20UP%20BOARD%20COCHING%20enquiry.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: YOUTUBE & PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 max-w-3xl">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Platform & YouTube Channel Configurations
            </h3>
            <p className="text-xs text-slate-500">
              Configure your YouTube Data API credentials, channel handles, exam countdown target, and emergency banner text.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
              ✓ Platform settings saved successfully!
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">YouTube Channel ID</label>
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="UC_UPBoardCoachingOfficial2026"
                  className="w-full p-2.5 border rounded-xl font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">YouTube Channel Handle</label>
                <input
                  type="text"
                  value={channelHandle}
                  onChange={(e) => setChannelHandle(e.target.value)}
                  placeholder="@UPBoardCoching"
                  className="w-full p-2.5 border rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Top Emergency / Live Alert Banner Text</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full p-2.5 border rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Next UP Board Exam Commencing Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2.5 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-950 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Save Admin Settings
            </button>
          </div>
        </form>
      )}

      {/* Add Live Modal */}
      {showAddLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form
            onSubmit={handleAddLiveSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-xl border border-slate-200 text-xs"
          >
            <h3 className="font-heading font-bold text-base text-slate-900">
              Schedule or Start YouTube Live Stream
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Class & Session Title</label>
              <input
                type="text"
                required
                value={newLiveTitle}
                onChange={(e) => setNewLiveTitle(e.target.value)}
                placeholder="e.g. Class 12 Physics: Wave Optics Full Derivation"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Class</label>
                <select
                  value={newLiveClass}
                  onChange={(e) => setNewLiveClass(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Subject</label>
                <input
                  type="text"
                  value={newLiveSubject}
                  onChange={(e) => setNewLiveSubject(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">YouTube Video / Stream ID</label>
                <input
                  type="text"
                  value={newLiveVideoId}
                  onChange={(e) => setNewLiveVideoId(e.target.value)}
                  placeholder="e.g. jfKfPfyJRdk"
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Teacher Name</label>
                <input
                  type="text"
                  value={newLiveTeacher}
                  onChange={(e) => setNewLiveTeacher(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddLiveModal(false)}
                className="px-4 py-2 border rounded-xl text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl"
              >
                Launch Live Stream
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Study Material Modal */}
      {showAddMatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form
            onSubmit={handleAddMatSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-xl border border-slate-200 text-xs"
          >
            <h3 className="font-heading font-bold text-base text-slate-900">
              Upload New Notes, PPT or Formula Sheet
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Material Title</label>
              <input
                type="text"
                required
                value={newMatTitle}
                onChange={(e) => setNewMatTitle(e.target.value)}
                placeholder="e.g. Class 12 Chemistry: Organic Name Reactions PPT"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Class</label>
                <select
                  value={newMatClass}
                  onChange={(e) => setNewMatClass(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Resource Format</label>
                <select
                  value={newMatType}
                  onChange={(e) => setNewMatType(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="notes">Handwritten Notes (PDF)</option>
                  <option value="ppt">PowerPoint Slide Deck (PPT)</option>
                  <option value="formula_sheet">Formula Cheat Sheet</option>
                  <option value="important_qa">Important Q&A Bank</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Summary Description</label>
              <textarea
                rows={2}
                value={newMatSummary}
                onChange={(e) => setNewMatSummary(e.target.value)}
                placeholder="Summary for students..."
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMatModal(false)}
                className="px-4 py-2 border rounded-xl text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-900 text-white font-semibold rounded-xl"
              >
                Upload File
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Notification Modal */}
      {showAddNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form
            onSubmit={handleAddNotifSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-xl border border-slate-200 text-xs"
          >
            <h3 className="font-heading font-bold text-base text-slate-900">
              Publish Verified UPMSP Announcement
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Notification Title</label>
              <input
                type="text"
                required
                value={newNotifTitle}
                onChange={(e) => setNewNotifTitle(e.target.value)}
                placeholder="e.g. Practical Exam 2027 Guidelines Released"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category</label>
                <select
                  value={newNotifCategory}
                  onChange={(e) => setNewNotifCategory(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="Time Table">Time Table</option>
                  <option value="Admit Card">Admit Card</option>
                  <option value="Practical Exams">Practical Exams</option>
                  <option value="Model Paper">Model Paper</option>
                  <option value="Registration">Registration</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Relevant Class</label>
                <select
                  value={newNotifClass}
                  onChange={(e) => setNewNotifClass(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="All Classes">All Classes</option>
                  <option value="Class 10 & 12">Class 10 & 12</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Notice Details</label>
              <textarea
                rows={3}
                value={newNotifDesc}
                onChange={(e) => setNewNotifDesc(e.target.value)}
                placeholder="Official details..."
                className="w-full p-2.5 border rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="urgent-check"
                checked={newNotifIsUrgent}
                onChange={(e) => setNewNotifIsUrgent(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <label htmlFor="urgent-check" className="font-semibold text-red-600">
                Mark as URGENT Announcement
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddNotifModal(false)}
                className="px-4 py-2 border rounded-xl text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-900 text-white font-semibold rounded-xl"
              >
                Publish Notice
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
