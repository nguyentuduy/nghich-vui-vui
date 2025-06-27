// pages/Customers.jsx
import React, { useState } from 'react';
import { UserPlus, Search, Star, Gift, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

const Customers = () => {
  const { customers, setCustomers } = useData();
  const { addNotification } = useNotification();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMembership, setFilterMembership] = useState('all');
  const [topUpAmount, setTopUpAmount] = useState('');

  const memberships = ['all', 'Bronze', 'Silver', 'Gold', 'Platinum'];
  
  const filteredCustomers = customers.filter(customer => {
    const matchSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       customer.phone.includes(searchQuery) ||
                       customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMembership = filterMembership === 'all' || customer.membership === filterMembership;
    return matchSearch && matchMembership;
  });

  const getMembershipColor = (membership) => {
    switch(membership) {
      case 'Platinum': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'Gold': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'Silver': return 'bg-gradient-to-r from-gray-400 to-gray-500';
      default: return 'bg-gradient-to-r from-orange-500 to-orange-600';
    }
  };

  const handleTopUp = () => {
    if (!topUpAmount || parseInt(topUpAmount) <= 0) {
      addNotification('Vui lòng nhập số tiền hợp lệ', 'error');
      return;
    }

    const amount = parseInt(topUpAmount);
    const bonus = amount >= 500000 ? 0.2 : amount >= 200000 ? 0.1 : amount >= 100000 ? 0.05 : 0;
    const totalAmount = amount + (amount * bonus);
    const points = Math.floor(amount / 1000);

    setCustomers(prev => prev.map(c => 
      c.id === selectedCustomer.id 
        ? { 
            ...c, 
            balance: c.balance + totalAmount,
            points: c.points + points,
            totalSpent: c.totalSpent + amount
          }
        : c
    ));

    addNotification(
      `Nạp tiền thành công! +${totalAmount.toLocaleString()}đ (+${points} điểm)` +
      (bonus > 0 ? ` - Khuyến mãi ${bonus * 100}%` : ''),
      'success'
    );
    
    setShowTopUpModal(false);
    setTopUpAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý khách hàng</h1>
          <p className="text-gray-500 mt-1">Tổng cộng {customers.length} khách hàng</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Thêm khách hàng
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, SĐT, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {memberships.map(membership => (
            <button
              key={membership}
              onClick={() => setFilterMembership(membership)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterMembership === membership
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {membership === 'all' ? 'Tất cả' : membership}
            </button>
          ))}
        </div>
      </div>

      {/* Membership Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Bronze', 'Silver', 'Gold', 'Platinum'].map(membership => {
          const count = customers.filter(c => c.membership === membership).length;
          return (
            <div key={membership} className={`p-4 rounded-xl text-white ${getMembershipColor(membership)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{membership} Members</p>
                  <p className="text-2xl font-bold mt-1">{count}</p>
                </div>
                <Star className="w-8 h-8 opacity-50" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số dư</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng chi tiêu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.slice(0, 10).map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold">
                        {customer.name[0]}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">ID: {customer.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{customer.phone}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${getMembershipColor(customer.membership)}`}>
                      {customer.membership}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {customer.balance.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-yellow-500" />
                      <span>{customer.points.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.totalSpent.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowTopUpModal(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        Nạp tiền
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[500px]">
            <h3 className="text-xl font-bold mb-4">Nạp tiền cho {selectedCustomer.name}</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Số dư hiện tại</p>
                <p className="text-2xl font-bold text-green-600">{selectedCustomer.balance.toLocaleString()}đ</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số tiền nạp</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số tiền..."
                />
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[100000, 200000, 500000, 1000000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      {(amount/1000)}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium mb-2">Khuyến mãi nạp tiền:</p>
                <ul className="text-sm space-y-1">
                  <li>• Nạp từ 100k: Tặng 5%</li>
                  <li>• Nạp từ 200k: Tặng 10%</li>
                  <li>• Nạp từ 500k: Tặng 20%</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleTopUp}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Xác nhận nạp tiền
                </button>
                <button
                  onClick={() => {
                    setShowTopUpModal(false);
                    setTopUpAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[500px]">
            <h3 className="text-xl font-bold mb-4">Thêm khách hàng mới</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input type="tel" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    addNotification('Thêm khách hàng thành công!', 'success');
                    setShowAddModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;