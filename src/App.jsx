// App.jsx
import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Computers from './pages/Computers';
import Customers from './pages/Customers';
import FoodService from './pages/FoodService';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import NotificationToast from './components/common/NotificationToast';

const NetCafeAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'computers': return <Computers />;
      case 'customers': return <Customers />;
      case 'food': return <FoodService />;
      case 'reports': return <Reports />;
      case 'staff': return <Staff />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar 
              isOpen={sidebarOpen} 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
              <Header 
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                sidebarOpen={sidebarOpen} 
              />
              
              <main className="p-6">
                {renderContent()}
              </main>
            </div>

            <NotificationToast />
          </div>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default NetCafeAdmin;