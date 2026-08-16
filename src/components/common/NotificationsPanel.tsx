import React from 'react';
import { X, Bell, AlertTriangle, TrendingUp, DollarSign, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Notification } from '../../types';
import { format, parseISO } from 'date-fns';

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead } = useAppContext();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'prediction':
        return <TrendingUp className="w-5 h-5 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'trade':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <div className="absolute right-0 top-16 w-full md:w-96 bg-white shadow-2xl rounded-md z-50 border border-gray-200 max-h-[80vh] overflow-auto">
      <div className="flex items-center justify-between bg-indigo-900 text-white p-4 sticky top-0">
        <h2 className="text-lg font-semibold flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-indigo-800 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleClick(notification.id)}
            >
              <div className="flex items-start">
                <div className="mr-3">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {format(parseISO(notification.date), 'MMM d, h:mm a')}
                  </p>
                </div>
                {!notification.read && (
                  <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;