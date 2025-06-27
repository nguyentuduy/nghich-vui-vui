// contexts/DataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [computers, setComputers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState({
    hourlyRate: 20000,
    vipRate: 30000,
    nightRate: 25000,
    nightStartHour: 22,
    nightEndHour: 6,
    vipDiscount: 0.2,
    memberDiscount: 0.1,
    autoLogoutTime: 5
  });

  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Computers với zones và specs
    const mockComputers = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `Máy ${i + 1}`,
      zone: i < 10 ? 'VIP' : i < 20 ? 'Thường' : 'Stream',
      status: Math.random() > 0.3 ? 'active' : 'available',
      specs: {
        cpu: i < 10 ? 'Intel i7-12700K' : 'Intel i5-10400F',
        gpu: i < 10 ? 'RTX 3070' : 'GTX 1660',
        ram: i < 10 ? '32GB' : '16GB',
        monitor: i < 10 ? '27" 144Hz' : '24" 75Hz'
      },
      customer: Math.random() > 0.3 ? `Khách ${Math.floor(Math.random() * 100)}` : null,
      startTime: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 3600000) : null,
      prepaidAmount: Math.floor(Math.random() * 100000),
      usedAmount: Math.floor(Math.random() * 50000)
    }));
    setComputers(mockComputers);

    // Customers với membership
    const mockCustomers = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      name: `Khách hàng ${i + 1}`,
      phone: `090${Math.floor(Math.random() * 10000000)}`,
      email: `user${i + 1}@gmail.com`,
      balance: Math.floor(Math.random() * 500000),
      totalSpent: Math.floor(Math.random() * 5000000),
      membership: ['Bronze', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)],
      points: Math.floor(Math.random() * 10000),
      registeredDate: new Date(Date.now() - Math.random() * 365 * 24 * 3600000),
      lastVisit: new Date(Date.now() - Math.random() * 7 * 24 * 3600000),
      status: Math.random() > 0.1 ? 'active' : 'banned'
    }));
    setCustomers(mockCustomers);

    // Menu items
    const mockMenu = [
      { id: 1, name: 'Mì tôm trứng', price: 15000, category: 'Mì', stock: 50, image: '🍜' },
      { id: 2, name: 'Mì xào bò', price: 35000, category: 'Mì', stock: 30, image: '🍝' },
      { id: 3, name: 'Bánh mì thịt', price: 20000, category: 'Bánh mì', stock: 40, image: '🥖' },
      { id: 4, name: 'Bánh mì trứng', price: 15000, category: 'Bánh mì', stock: 35, image: '🥖' },
      { id: 5, name: 'Cơm chiên dương châu', price: 30000, category: 'Cơm', stock: 25, image: '🍛' },
      { id: 6, name: 'Cơm gà xối mỡ', price: 35000, category: 'Cơm', stock: 20, image: '🍗' },
      { id: 7, name: 'Coca Cola', price: 10000, category: 'Nước ngọt', stock: 100, image: '🥤' },
      { id: 8, name: 'Pepsi', price: 10000, category: 'Nước ngọt', stock: 80, image: '🥤' },
      { id: 9, name: 'Sting', price: 10000, category: 'Nước tăng lực', stock: 90, image: '⚡' },
      { id: 10, name: 'Redbull', price: 15000, category: 'Nước tăng lực', stock: 60, image: '🐂' },
      { id: 11, name: 'Cà phê đen', price: 12000, category: 'Cà phê', stock: 999, image: '☕' },
      { id: 12, name: 'Cà phê sữa', price: 15000, category: 'Cà phê', stock: 999, image: '☕' },
      { id: 13, name: 'Trà sữa', price: 25000, category: 'Trà', stock: 50, image: '🧋' },
      { id: 14, name: 'Snack khoai tây', price: 10000, category: 'Snack', stock: 70, image: '🍟' },
      { id: 15, name: 'Bánh quy', price: 8000, category: 'Snack', stock: 80, image: '🍪' }
    ];
    setMenuItems(mockMenu);

    // Staff
    const mockStaff = [
      { id: 1, name: 'Nguyễn Văn A', role: 'Admin', shift: 'Sáng', phone: '0901234567', salary: 8000000, status: 'active' },
      { id: 2, name: 'Trần Thị B', role: 'Nhân viên', shift: 'Chiều', phone: '0912345678', salary: 6000000, status: 'active' },
      { id: 3, name: 'Lê Văn C', role: 'Nhân viên', shift: 'Tối', phone: '0923456789', salary: 6500000, status: 'active' },
      { id: 4, name: 'Phạm Thị D', role: 'Kế toán', shift: 'Sáng', phone: '0934567890', salary: 7000000, status: 'active' }
    ];
    setStaff(mockStaff);

    // Promotions
    const mockPromotions = [
      { id: 1, name: 'Giảm 20% giờ chơi VIP', type: 'discount', value: 20, startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 3600000), status: 'active' },
      { id: 2, name: 'Tặng 1 giờ khi nạp 100k', type: 'bonus', value: 60, minAmount: 100000, status: 'active' },
      { id: 3, name: 'Combo ăn uống giảm 15%', type: 'combo', value: 15, status: 'active' }
    ];
    setPromotions(mockPromotions);

    // Mock orders
    const mockOrders = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      customerName: `Khách ${Math.floor(Math.random() * 50)}`,
      computerName: `Máy ${Math.floor(Math.random() * 30) + 1}`,
      items: [
        { id: 1, name: 'Mì tôm', price: 15000, quantity: Math.floor(Math.random() * 3) + 1 }
      ],
      total: Math.floor(Math.random() * 50000) + 10000,
      time: new Date(Date.now() - Math.random() * 3600000),
      status: Math.random() > 0.2 ? 'completed' : 'pending'
    }));
    setOrders(mockOrders);
  };

  const addPayment = (payment) => {
    setPayments(prev => [...prev, { ...payment, id: Date.now(), timestamp: new Date() }]);
  };

  const updateComputerStatus = (computerId, updates) => {
    setComputers(prev => prev.map(c => c.id === computerId ? { ...c, ...updates } : c));
  };

  const value = {
    computers, setComputers, updateComputerStatus,
    customers, setCustomers,
    orders, setOrders,
    staff, setStaff,
    sessions, setSessions,
    menuItems, setMenuItems,
    promotions, setPromotions,
    payments, addPayment,
    settings, setSettings
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};