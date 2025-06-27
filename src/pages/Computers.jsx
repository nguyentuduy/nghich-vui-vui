// pages/Computers.jsx
import React, { useState, useEffect } from 'react';
import { Monitor, Clock, Wifi, Settings, Search, X, Printer } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

const Computers = () => {
  const { computers, updateComputerStatus, customers, settings, addPayment } = useData();
  const { addNotification } = useNotification();
  const [selectedZone, setSelectedZone] = useState('all');
  const [showStartModal, setShowStartModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [prepaidAmount, setPrepaidAmount] = useState('');

  const zones = ['all', 'VIP', 'Thường', 'Stream'];
  
  const filteredComputers = selectedZone === 'all' 
    ? computers 
    : computers.filter(c => c.zone === selectedZone);

  const calculateTime = (startTime) => {
    if (!startTime) return '00:00:00';
    const diff = Date.now() - new Date(startTime).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateAmount = (computer) => {
    if (!computer.startTime) return 0;
    const hours = (Date.now() - new Date(computer.startTime).getTime()) / 3600000;
    const rate = computer.zone === 'VIP' ? settings.vipRate : settings.hourlyRate;
    const currentHour = new Date().getHours();
    const nightRate = (currentHour >= settings.nightStartHour || currentHour < settings.nightEndHour) 
      ? settings.nightRate : rate;
    return Math.floor(hours * nightRate);
  };

  const handleStartComputer = (computer) => {
    setSelectedComputer(computer);
    setShowStartModal(true);
  };

  const handleConfirmStart = () => {
    if (!selectedCustomer && !prepaidAmount) {
      addNotification('Vui lòng chọn khách hàng hoặc nhập số tiền trả trước', 'error');
      return;
    }

    updateComputerStatus(selectedComputer.id, {
      status: 'active',
      customer: selectedCustomer?.name || 'Khách lẻ',
      customerId: selectedCustomer?.id,
      startTime: new Date(),
      prepaidAmount: parseInt(prepaidAmount) || 0,
      usedAmount: 0
    });

    addNotification(`Máy ${selectedComputer.name} đã bắt đầu`, 'success');
    setShowStartModal(false);
    resetStartModal();
  };

  const handleStopComputer = (computer) => {
    setSelectedComputer(computer);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    const finalAmount = calculateAmount(selectedComputer);
    const change = selectedComputer.prepaidAmount - finalAmount;

    addPayment({
      computerId: selectedComputer.id,
      customerName: selectedComputer.customer,
      amount: finalAmount,
      type: 'computer',
      duration: calculateTime(selectedComputer.startTime)
    });

    updateComputerStatus(selectedComputer.id, {
      status: 'available',
      customer: null,
      customerId: null,
      startTime: null,
      prepaidAmount: 0,
      usedAmount: 0
    });

    addNotification(
      `Thanh toán máy ${selectedComputer.name}: ${finalAmount.toLocaleString()}đ` + 
      (change > 0 ? ` - Tiền thừa: ${change.toLocaleString()}đ` : ''),
      'success'
    );
    
    setShowPaymentModal(false);
  };

  const resetStartModal = () => {
    setSelectedCustomer(null);
    setSearchCustomer('');
    setPrepaidAmount('');
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.phone.includes(searchCustomer)
  );

  // Real-time update
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update time
      setSelectedZone(prev => prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý máy tính</h1>
          <p className="text-gray-500 mt-1">Theo dõi và quản lý {computers.length} máy</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            Remote Control
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Cài đặt máy
          </button>
        </div>
      </div>

      {/* Zone Filter */}
      <div className="flex gap-4 items-center">
        <span className="font-medium">Khu vực:</span>
        <div className="flex gap-2">
          {zones.map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedZone === zone
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50'
              }`}
            >
              {zone === 'all' ? 'Tất cả' : zone}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Trống ({computers.filter(c => c.status === 'available').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Đang sử dụng ({computers.filter(c => c.status === 'active').length})</span>
          </div>
        </div>
      </div>

      {/* Computers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredComputers.map(computer => (
          <div
            key={computer.id}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
              computer.status === 'active'
                ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-400 shadow-lg'
                : 'bg-gradient-to-br from-green-50 to-green-100 border-green-400 hover:shadow-lg'
            }`}
            onClick={() => computer.status === 'available' ? handleStartComputer(computer) : null}
          >
            {/* Zone Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
              computer.zone === 'VIP' ? 'bg-purple-500 text-white' :
              computer.zone === 'Stream' ? 'bg-blue-500 text-white' :
              'bg-gray-400 text-white'
            }`}>
              {computer.zone}
            </div>

            <div className="text-center">
              <Monitor className={`w-12 h-12 mx-auto mb-2 ${
                computer.status === 'active' ? 'text-red-500' : 'text-green-500'
              }`} />
              <h3 className="font-bold text-lg">{computer.name}</h3>
              
              {computer.status === 'active' ? (
                <>
                  <p className="text-sm text-gray-600 mt-1 font-medium">{computer.customer}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono font-bold">{calculateTime(computer.startTime)}</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      {calculateAmount(computer).toLocaleString()}đ
                    </p>
                    {computer.prepaidAmount > 0 && (
                      <p className="text-xs text-gray-500">
                        Trả trước: {computer.prepaidAmount.toLocaleString()}đ
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStopComputer(computer);
                    }}
                    className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                  >
                    Tính tiền
                  </button>
                </>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Sẵn sàng</p>
                  <div className="mt-2 space-y-1 text-xs text-gray-400">
                    <p>{computer.specs.cpu}</p>
                    <p>{computer.specs.gpu}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Start Computer Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Bắt đầu sử dụng {selectedComputer?.name} - {selectedComputer?.zone}
            </h3>
            
            <div className="space-y-4">
              {/* Customer Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Tìm khách hàng</label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchCustomer}
                    onChange={(e) => setSearchCustomer(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên hoặc số điện thoại..."
                  />
                </div>
                
                {searchCustomer && (
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.slice(0, 5).map(customer => (
                        <div
                          key={customer.id}
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setSearchCustomer('');
                          }}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{customer.membership}</p>
                            <p className="text-sm text-gray-500">Số dư: {customer.balance.toLocaleString()}đ</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-center text-gray-500">Không tìm thấy khách hàng</p>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Customer */}
              {selectedCustomer && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{selectedCustomer.name}</p>
                      <p className="text-sm text-gray-600">{selectedCustomer.membership} - {selectedCustomer.points} điểm</p>
                      <p className="text-sm">Số dư: {selectedCustomer.balance.toLocaleString()}đ</p>
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Prepaid Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Số tiền trả trước</label>
                <input
                  type="number"
                  value={prepaidAmount}
                  onChange={(e) => setPrepaidAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số tiền..."
                />
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[50000, 100000, 200000, 500000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setPrepaidAmount(amount.toString())}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      {(amount/1000)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleConfirmStart}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Bắt đầu
                </button>
                <button
                  onClick={() => {
                    setShowStartModal(false);
                    resetStartModal();
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

      {/* Payment Modal */}
      {showPaymentModal && selectedComputer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[500px]">
            <h3 className="text-xl font-bold mb-4">Thanh toán {selectedComputer.name}</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Khách hàng:</span>
                  <span className="font-medium">{selectedComputer.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian sử dụng:</span>
                  <span className="font-medium">{calculateTime(selectedComputer.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loại máy:</span>
                  <span className="font-medium">{selectedComputer.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Đơn giá:</span>
                  <span className="font-medium">
                    {(selectedComputer.zone === 'VIP' ? settings.vipRate : settings.hourlyRate).toLocaleString()}đ/giờ
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng tiền:</span>
                  <span className="text-red-600">{calculateAmount(selectedComputer).toLocaleString()}đ</span>
                </div>
                {selectedComputer.prepaidAmount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Đã trả trước:</span>
                      <span className="font-medium">{selectedComputer.prepaidAmount.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tiền thừa/thiếu:</span>
                      <span className={selectedComputer.prepaidAmount - calculateAmount(selectedComputer) >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(selectedComputer.prepaidAmount - calculateAmount(selectedComputer)).toLocaleString()}đ
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Thanh toán & In hóa đơn
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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

export default Computers;