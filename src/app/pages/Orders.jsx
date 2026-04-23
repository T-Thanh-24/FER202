import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Package, Truck, CheckCircle, XCircle, Clock, ShoppingBag, Filter } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function Orders() {
  const { user } = useAuth();
  const { getUserOrders, updateOrderStatus } = useOrders();
  const allOrders = user ? getUserOrders(user.id) : [];
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = statusFilter === 'all'
    ? allOrders
    : allOrders.filter(o => o.status.toLowerCase() === statusFilter.toLowerCase());

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Confirmed': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusLabels = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Shipped: 'Đang giao',
    Delivered: 'Đã giao',
    Cancelled: 'Đã hủy',
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      updateOrderStatus(orderId, 'Cancelled');
      toast.success('Đã hủy đơn hàng!');
    }
  };

  const filterTabs = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Pending', label: 'Chờ xác nhận' },
    { value: 'Confirmed', label: 'Đã xác nhận' },
    { value: 'Shipped', label: 'Đang giao' },
    { value: 'Delivered', label: 'Đã giao' },
    { value: 'Cancelled', label: 'Đã hủy' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Đăng nhập ngay →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 0 60px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 6px', color: '#0f172a' }}>
            📦 Đơn hàng của tôi
          </h1>
          <p style={{ margin: 0, color: '#64748b' }}>{allOrders.length} đơn hàng</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: '1px solid',
                borderColor: statusFilter === tab.value ? '#2563eb' : '#e5e7eb',
                background: statusFilter === tab.value ? '#2563eb' : '#fff',
                color: statusFilter === tab.value ? '#fff' : '#374151',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span style={{
                  marginLeft: 6,
                  background: statusFilter === tab.value ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  padding: '1px 6px',
                  borderRadius: 999,
                  fontSize: 11,
                }}>
                  {allOrders.filter(o => o.status === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {orders.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '60px 32px',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
          }}>
            <Package size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
              {statusFilter === 'all' ? 'Chưa có đơn hàng nào' : `Không có đơn hàng "${filterTabs.find(t => t.value === statusFilter)?.label}"`}
            </h2>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>Bắt đầu mua sắm ngay hôm nay!</p>
            <Link
              to="/products"
              style={{
                display: 'inline-block',
                background: '#2563eb',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: 10,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                {/* Order Header */}
                <div style={{
                  background: '#f8fafc',
                  padding: '16px 24px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Mã đơn hàng</p>
                      <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: 14 }}>#{order.id}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Ngày đặt</p>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </span>
                    {(order.status === 'Pending' || order.status === 'pending') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        style={{
                          padding: '6px 14px',
                          background: '#fff',
                          color: '#ef4444',
                          border: '1px solid #fecaca',
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15 }}>{item.product.name}</p>
                          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                            Size: {item.size} · Số lượng: {item.quantity}
                          </p>
                        </div>
                        <p style={{ fontWeight: 700, color: '#2563eb', fontSize: 15, margin: 0 }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
                        +{order.items.length - 2} sản phẩm khác
                      </p>
                    )}
                  </div>

                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}>
                    <div>
                      <span style={{ fontSize: 13, color: '#6b7280' }}>Tổng cộng: </span>
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#2563eb' }}>
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      style={{
                        padding: '10px 20px',
                        background: '#2563eb',
                        color: '#fff',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}