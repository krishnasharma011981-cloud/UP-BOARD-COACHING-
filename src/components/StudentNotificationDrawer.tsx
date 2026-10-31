/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Bell, Check, Video, FileText, Calendar, ExternalLink } from 'lucide-react';
import { StudentNotificationItem, PageView } from '../types';
import { storageService } from '../services/storageService';

interface StudentNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: StudentNotificationItem[];
  onRefresh: () => void;
  onNavigate: (page: PageView) => void;
}

export const StudentNotificationDrawer: React.FC<StudentNotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    storageService.markNotificationAsRead(id);
    onRefresh();
  };

  const handleAction = (notif: StudentNotificationItem) => {
    handleMarkAsRead(notif.id);
    if (notif.actionUrl) {
      onNavigate(notif.actionUrl as PageView);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 bg-blue-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-base">Student Notifications</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No new notifications. You are all caught up!
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    item.read
                      ? 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-heading font-bold text-xs text-blue-950">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed mb-2.5">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-medium text-[10px]">
                      {item.classLevel}
                    </span>

                    <div className="flex items-center gap-2">
                      {!item.read && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          className="text-slate-500 hover:text-blue-700 font-medium cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                      {item.actionUrl && (
                        <button
                          onClick={() => handleAction(item)}
                          className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Real-time updates synced with UP Board exam board & live sessions.
          </div>

        </div>
      </div>
    </div>
  );
};
