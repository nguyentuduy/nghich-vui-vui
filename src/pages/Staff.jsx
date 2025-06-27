// pages/Staff.jsx
import React from 'react';
import { UserPlus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

const Staff = () => {
  const { staff } = useData();
  const { addNotification } = useNotification();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
          <p className="text-gray-500 mt-1">Tổng cộng {staff.length} nhân viên</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Thêm nhân viên
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức vụ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca làm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lương</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {staff.map(employee => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold">
                      {employee.name[0]}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    employee.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {employee.role}
                  </span>
                </td>
                <td className="px-6 py-4">{employee.shift}</td>
                <td className="px-6 py-4 font-semibold">{employee.salary.toLocaleString()}đ</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Đang làm
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">Sửa</button>
                  <button className="text-red-600 hover:text-red-800">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;