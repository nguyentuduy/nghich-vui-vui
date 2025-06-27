// pages/Dashboard.jsx
import React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Monitor, Users, DollarSign, Coffee, TrendingUp, Activity, UserPlus, CreditCard, Download, Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Dashboard = () => {
  const { computers, customers, orders, payments } = useData();

  // Calculate statistics
  const activeComputers = computers.filter(c => c.status === 'active').length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const todayRevenue = payments
    .filter(p => p.timestamp && new Date(p.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const todayCustomers = customers.filter(c => 
    c.lastVisit && new Date(c.lastVisit).toDateString() === new Date().toDateString()
  ).length;

  // Revenue data for charts
  const hourlyRevenue = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    revenue: Math.floor(Math.random() * 500000) + 100000,
    customers: Math.floor(Math.random() * 20) + 5
  }));

  const serviceBreakdown = [
    { name: 'Giờ máy thường', value: 45, amount: 2500000, color: '#3b82f6' },
    { name: 'Giờ máy VIP', value: 25, amount: 1800000, color: '#8b5cf6' },
    { name: 'Đồ ăn', value: 20, amount: 1200000, color: '#10b981' },
    { name: 'Nước uống', value: 10, amount: 600000, color: '#f59e0b' }
  ];

  const topCustomers = customers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
          <p className="text-gray-500 mt-1">Quản lý và theo dõi hoạt động quán net</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Hôm nay
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Máy hoạt động</p>
              <p className="text-3xl font-bold mt-2">{activeComputers}/{computers.length}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <Activity className="w-4 h-4" />
                <span>{Math.round(activeComputers/computers.length * 100)}% sử dụng</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Monitor className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Doanh thu hôm nay</p>
              <p className="text-3xl font-bold mt-2">{(todayRevenue/1000000).toFixed(1)}M</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+23% so với hôm qua</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Khách hôm nay</p>
              <p className="text-3xl font-bold mt-2">{todayCustomers}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <Users className="w-4 h-4" />
                <span>{customers.filter(c => c.membership === 'Gold' || c.membership === 'Platinum').length} VIP</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Đơn đồ ăn</p>
              <p className="text-3xl font-bold mt-2">{orders.filter(o => o.status === 'pending').length}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <Coffee className="w-4 h-4" />
                <span>{orders.length} tổng đơn</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Coffee className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Doanh thu theo giờ</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">Hôm nay</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-50 rounded-lg">Tuần này</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-50 rounded-lg">Tháng này</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `${(value/1000).toFixed(0)}k`}
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Phân bố doanh thu</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={serviceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {serviceBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">{(item.amount/1000000).toFixed(1)}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Top khách hàng</h3>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    customer.membership === 'Platinum' ? 'bg-purple-500' :
                    customer.membership === 'Gold' ? 'bg-yellow-500' :
                    customer.membership === 'Silver' ? 'bg-gray-400' :
                    'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.membership}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{(customer.totalSpent/1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-500">{customer.points} điểm</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Khách hàng mới đăng ký</p>
                <p className="text-sm text-gray-500">Nguyễn Văn A - 2 phút trước</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nạp tiền thành công</p>
                <p className="text-sm text-gray-500">200,000đ - Máy 15 - 5 phút trước</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Đơn hàng mới</p>
                <p className="text-sm text-gray-500">2x Mì tôm, 1x Sting - Máy 8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;