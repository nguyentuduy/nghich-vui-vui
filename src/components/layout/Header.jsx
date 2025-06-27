// components/layout/Header.jsx
import React, { useState } from 'react';
import { Menu, X, Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Thông báo</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <p className="text-sm font-medium">Máy 5 sắp hết thời gian</p>
                    <p className="text-xs text-gray-500">2 phút trước</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <p className="text-sm font-medium">Khách hàng VIP đã đăng nhập</p>
                    <p className="text-xs text-gray-500">5 phút trước</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;