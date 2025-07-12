import React, { useState, useEffect } from 'react';
import { api, handleApiError } from '../services/api';
import { Bell, Check, Clock } from 'lucide-react';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getNotifications();
            setNotifications(data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await api.markNotificationRead(notificationId);
            // Update local state
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, read: true } : notif
                )
            );
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50 max-h-96 overflow-y-auto">
            <div className="px-4 py-2 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-secondary-900">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>

            {loading && (
                <div className="px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-sm text-secondary-600 mt-2">Loading notifications...</p>
                </div>
            )}

            {error && (
                <div className="px-4 py-4">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {!loading && !error && notifications.length === 0 && (
                <div className="px-4 py-8 text-center">
                    <Bell className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">No notifications yet</p>
                </div>
            )}

            {!loading && !error && notifications.length > 0 && (
                <div className="space-y-1">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-secondary-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-secondary-900 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-secondary-400" />
                                        <span className="text-xs text-secondary-500">
                                            {formatTime(notification.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                {!notification.read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="p-1 text-secondary-400 hover:text-primary-600 transition-colors"
                                        title="Mark as read"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown; 