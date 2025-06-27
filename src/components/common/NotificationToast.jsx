// components/common/NotificationToast.jsx
import React from 'react';
import { Bell, X } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            notification.type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          <Bell className="w-5 h-5" />
          <p className="flex-1">{notification.message}</p>
          <button onClick={() => removeNotification(notification.id)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;