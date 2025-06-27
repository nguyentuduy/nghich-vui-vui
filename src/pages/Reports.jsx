// pages/Reports.jsx
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Printer, Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Reports = () => {
  const { computers, customers, orders, payments } = useData();
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('today');

  // Calculate report data
  const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
    month: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'][i],
    revenue: Math.floor(Math.random() * 50000000) + 80000000,
    customers: Math.floor(Math.random() * 500) + 800
  }));

  const customerGrowth = Array.from({ length: 7 }, (_, i) => ({
    day: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i],
    newCustomers: Math.floor(Math.random() * 20) + 10,
    totalCustomers: 1000 + (i * 15)
  }));

  const topServices = [
    { name: 'Giờ máy VIP', revenue: 45000000, percentage: 35 },
    { name: 'Giờ máy thường', revenue: 38000000, percentage: 30 },
    { name: 'Đồ ăn', revenue: 25000000, percentage: 20 },
    { name: 'Nước uống', revenue: 19000000, percentage: 15 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo & Thống kê</h1>
          <p className="text-gray-500 mt-1">Phân tích chi tiết hoạt động kinh doanh</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Printer className="w-4 h-4" />
            In báo cáo
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'revenue', label: 'Doanh thu' },
          { id: 'customers', label: 'Khách hàng' },
          { id: 'services', label: 'Dịch vụ' },
          { id: 'staff', label: 'Nhân viên' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              reportType === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${(value/1000000).toFixed(1)}M`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Tổng quan</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu {dateRange === 'today' ? 'hôm nay' : dateRange === 'week' ? 'tuần này' : dateRange === 'month' ? 'tháng này' : 'năm nay'}</p>
                  <p className="text-3xl font-bold text-green-600">152.5M</p>
                  <p className="text-sm text-green-500 mt-1">↑ 15.2% so với kỳ trước</p>
                </div>
                <hr />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Số giờ máy</p>
                    <p className="text-xl font-bold">2,845</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Đơn hàng F&B</p>
                    <p className="text-xl font-bold">462</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Top dịch vụ</h3>
              <div className="space-y-3">
                {topServices.map((service, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{service.name}</span>
                      <span className="text-sm">{(service.revenue/1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Report */}
      {reportType === 'customers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Tăng trưởng khách hàng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="newCustomers" stroke="#10b981" name="Khách mới" />
                <Line type="monotone" dataKey="totalCustomers" stroke="#3b82f6" name="Tổng khách" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Phân bố membership</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Bronze', value: 45, color: '#f97316' },
                    { name: 'Silver', value: 30, color: '#6b7280' },
                    { name: 'Gold', value: 20, color: '#eab308' },
                    { name: 'Platinum', value: 5, color: '#8b5cf6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {[
                    { name: 'Bronze', value: 45, color: '#f97316' },
                    { name: 'Silver', value: 30, color: '#6b7280' },
                    { name: 'Gold', value: 20, color: '#eab308' },
                    { name: 'Platinum', value: 5, color: '#8b5cf6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Services Report */}
      {reportType === 'services' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Báo cáo dịch vụ</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Tổng</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topServices.map((service, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{service.name}</td>
                    <td className="px-6 py-4">{Math.floor(Math.random() * 1000) + 500}</td>
                    <td className="px-6 py-4 font-semibold">{(service.revenue/1000000).toFixed(1)}M</td>
                    <td className="px-6 py-4">{service.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Report */}
      {reportType === 'staff' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Báo cáo nhân viên</h3>
          <p className="text-gray-500">Chức năng đang phát triển...</p>
        </div>
      )}
    </div>
  );
};

export default Reports;