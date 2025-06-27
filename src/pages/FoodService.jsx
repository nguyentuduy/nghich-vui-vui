// pages/FoodService.jsx
import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

const FoodService = () => {
  const { menuItems, orders, setOrders, computers } = useData();
  const { addNotification } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedComputer, setSelectedComputer] = useState('');

  const categories = ['all', 'Mì', 'Bánh mì', 'Cơm', 'Nước ngọt', 'Nước tăng lực', 'Cà phê', 'Trà', 'Snack'];
  
  const filteredMenu = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const activeComputers = computers.filter(c => c.status === 'active');

  const addToCart = (item) => {
    const existingItem = cart.find(c => c.id === item.id);
    if (existingItem) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    addNotification(`Đã thêm ${item.name} vào giỏ hàng`, 'success');
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(c => c.id === itemId ? { ...c, quantity } : c));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCreateOrder = () => {
    if (cart.length === 0) {
      addNotification('Giỏ hàng trống!', 'error');
      return;
    }

    const newOrder = {
      id: Date.now(),
      computerName: selectedComputer || 'Mang về',
      items: cart,
      total: getTotalAmount(),
      time: new Date(),
      status: 'pending'
    };

    setOrders([...orders, newOrder]);
    addNotification('Tạo đơn hàng thành công!', 'success');
    setCart([]);
    setShowOrderModal(false);
    setSelectedComputer('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dịch vụ đồ ăn & nước uống</h1>
          <p className="text-gray-500 mt-1">Quản lý menu và đơn hàng</p>
        </div>
        <button
          onClick={() => setShowOrderModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Giỏ hàng ({cart.length})
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {category === 'all' ? 'Tất cả' : category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredMenu.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-4">
                  <div className="text-4xl text-center mb-3">{item.image}</div>
                  <h3 className="font-bold text-center">{item.name}</h3>
                  <p className="text-center text-sm text-gray-500 mt-1">{item.category}</p>
                  <p className="text-center text-lg font-bold text-green-600 mt-2">
                    {item.price.toLocaleString()}đ
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Kho: {item.stock}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {orders.slice(-10).reverse().map(order => (
              <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{order.computerName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.time).toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                  </span>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t flex justify-between items-center">
                  <p className="font-bold">{order.total.toLocaleString()}đ</p>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => {
                        setOrders(orders.map(o => 
                          o.id === order.id ? { ...o, status: 'completed' } : o
                        ));
                        addNotification('Đã hoàn thành đơn hàng', 'success');
                      }}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      Hoàn thành
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Giỏ hàng</h3>
            
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Giỏ hàng trống</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Chọn máy</label>
                  <select
                    value={selectedComputer}
                    onChange={(e) => setSelectedComputer(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Mang về</option>
                    {activeComputers.map(comp => (
                      <option key={comp.id} value={comp.name}>
                        {comp.name} - {comp.customer}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price.toLocaleString()}đ</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-500 hover:text-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">{getTotalAmount().toLocaleString()}đ</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateOrder}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Tạo đơn hàng
                  </button>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodService;