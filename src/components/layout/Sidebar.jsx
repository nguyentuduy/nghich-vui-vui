// components/layout/Sidebar.jsx
import React from 'react';
import { TrendingUp, Monitor, Users, Coffee, FileText, UserCheck, Settings, Power } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: TrendingUp },
    { id: 'computers', label: 'Quản lý máy', icon: Monitor },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'food', label: 'Đồ ăn & Nước', icon: Coffee },
    { id: 'reports', label: 'Báo cáo', icon: FileText },
    { id: 'staff', label: 'Nhân viên', icon: UserCheck },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-0'
    } overflow-hidden`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          NetCafe Pro
        </h1>
        
        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Power className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;