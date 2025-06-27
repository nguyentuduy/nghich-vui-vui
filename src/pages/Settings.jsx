// pages/Settings.jsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

const Settings = () => {
  const { settings, setSettings } = useData();
  const { addNotification } = useNotification();

  const handleSaveSettings = () => {
    addNotification('Đã lưu cài đặt thành công!', 'success');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Cài đặt giá</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Giá giờ máy thường</label>
              <input
                type="number"
                value={settings.hourlyRate}
                onChange={(e) => setSettings({...settings, hourlyRate: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá giờ máy VIP</label>
              <input
                type="number"
                value={settings.vipRate}
                onChange={(e) => setSettings({...settings, vipRate: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá giờ đêm</label>
              <input
                type="number"
                value={settings.nightRate}
                onChange={(e) => setSettings({...settings, nightRate: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Giờ đêm bắt đầu</label>
                <input
                  type="number"
                  value={settings.nightStartHour}
                  onChange={(e) => setSettings({...settings, nightStartHour: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="23"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giờ đêm kết thúc</label>
                <input
                  type="number"
                  value={settings.nightEndHour}
                  onChange={(e) => setSettings({...settings, nightEndHour: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="23"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Cài đặt khuyến mãi</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Giảm giá VIP (%)</label>
              <input
                type="number"
                value={settings.vipDiscount * 100}
                onChange={(e) => setSettings({...settings, vipDiscount: parseInt(e.target.value) / 100})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giảm giá thành viên (%)</label>
              <input
                type="number"
                value={settings.memberDiscount * 100}
                onChange={(e) => setSettings({...settings, memberDiscount: parseInt(e.target.value) / 100})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thời gian tự động đăng xuất (phút)</label>
              <input
                type="number"
                value={settings.autoLogoutTime}
                onChange={(e) => setSettings({...settings, autoLogoutTime: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Cài đặt hệ thống</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Chế độ tối</p>
                <p className="text-sm text-gray-500">Bật/tắt giao diện tối</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Thông báo âm thanh</p>
                <p className="text-sm text-gray-500">Phát âm thanh khi có thông báo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Sao lưu tự động</p>
                <p className="text-sm text-gray-500">Tự động sao lưu dữ liệu hàng ngày</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin quán</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên quán</label>
              <input
                type="text"
                defaultValue="NetCafe Pro"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <input
                type="text"
                defaultValue="123 Nguyễn Văn Linh, Q7, TP.HCM"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input
                type="tel"
                defaultValue="0901234567"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg"
        >
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
};

export default Settings;