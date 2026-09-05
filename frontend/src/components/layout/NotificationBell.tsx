import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, FileText, ChevronRight } from 'lucide-react';
import { notificationsApi } from '../../api/notifications';
import type { AppNotification } from '../../types';
import { formatDate } from '../../utils/format';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [isOpen, setIsOpen]               = useState(false);
  const dropdownRef                       = useRef<HTMLDivElement>(null);
  const navigate                          = useNavigate();

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getMyNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch {
      // Silently catch fetch errors (e.g. unauthenticated)
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string, proposalId: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setIsOpen(false);
      navigate(`/researcher/proposals/${proposalId}`);
    } catch {
      navigate(`/researcher/proposals/${proposalId}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-slide-up">
          {/* Dropdown Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-bold text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-0.5">You'll receive alerts when reviewers evaluate your proposals.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleMarkRead(item._id, item.proposal_id)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                    !item.read ? 'bg-primary-50/40 border-l-4 border-primary-500' : ''
                  }`}
                >
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl mt-0.5 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-bold ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-1 mt-1 text-[11px] text-primary-600 font-medium">
                      <span>View Proposal</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
