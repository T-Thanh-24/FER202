import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, ShoppingBag, Tag, Truck, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const COUPONS = {
  'FIVEPIGS10': { discount: 0.10, label: 'Giảm 10%' },
  'SALE20': { discount: 0.20, label: 'Giảm 20%' },
  'FREESHIP': { discount: 0, freeShipping: true, label: 'Miễn phí vận chuyển' },
  'NEWUSER': { discount: 0.15, label: 'Giảm 15% cho khách mới' },
};

const FREE_SHIPPING_THRESHOLD = 500000;

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const discountAmount = appliedCoupon ? Math.round(totalPrice * (appliedCoupon.discount || 0)) : 0;
  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD || (appliedCoupon?.freeShipping);
  const shippingFee = isFreeShipping ? 0 : 30000;
  const finalTotal = totalPrice - discountAmount + shippingFee;

  const progressToFreeShip = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShip = Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0);

  const handleApplyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    if (!code) return;
    if (COUPONS[code]) {
      setAppliedCoupon({ ...COUPONS[code], code });
      toast.success(`Áp dụng mã "${code}" thành công! ${COUPONS[code].label}`);
    } else {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    toast.info('Đã xóa mã giảm giá');
  };

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <ShoppingBag size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Vui lòng đăng nhập</h2>
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Đăng nhập ngay →</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <ShoppingBag size={80} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Giỏ hàng trống</h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Thêm sản phẩm vào giỏ để tiến hành mua sắm!</p>
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
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 0 60px' }}>
      <div className="container">
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, color: '#0f172a' }}>
          🛒 Giỏ hàng của bạn
        </h1>

        {/* Shipping Progress */}
        {!isFreeShipping && (
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 12,
            padding: '14px 20px',
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#1d4ed8' }}>
              <Truck size={18} />
              Còn <strong>{formatPrice(remainingForFreeShip)}</strong> nữa để được miễn phí vận chuyển!
            </div>
            <div style={{ background: '#dbeafe', borderRadius: 999, height: 8, overflow: 'hidden' }}>
              <div
                style={{
                  background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                  height: '100%',
                  width: `${progressToFreeShip}%`,
                  borderRadius: 999,
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>
        )}

        {isFreeShipping && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 12,
            padding: '14px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#15803d',
          }}>
            <Truck size={18} />
            🎉 Bạn đã được miễn phí vận chuyển!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div
                key={`${item.product.id}-${item.size}`}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  border: '1px solid #e5e7eb',
                  padding: 16,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Link to={`/products/${item.product.id}`}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                  />
                </Link>
                <div style={{ flex: 1 }}>
                  <Link
                    to={`/products/${item.product.id}`}
                    style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', textDecoration: 'none', display: 'block', marginBottom: 4 }}
                  >
                    {item.product.name}
                  </Link>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 6px' }}>
                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>{item.product.category}</span>
                    {' · '}
                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                      Size: {item.size}
                    </span>
                  </p>
                  <p style={{ fontWeight: 900, color: '#2563eb', fontSize: 16, margin: 0 }}>
                    {formatPrice(item.product.price)}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.size)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 4,
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                      style={{ padding: '6px 10px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                      style={{ padding: '6px 10px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, margin: 0 }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 24, marginBottom: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: '#0f172a' }}>Tóm tắt đơn hàng</h2>

              {/* Coupon */}
              <div style={{ marginBottom: 16 }}>
                {appliedCoupon ? (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Tag size={16} color="#16a34a" />
                      <span style={{ fontWeight: 700, color: '#15803d', fontSize: 14 }}>
                        {appliedCoupon.code} · {appliedCoupon.label}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá..."
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      style={{
                        padding: '10px 14px',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '6px 0 0' }}>
                  Thử: FIVEPIGS10, SALE20, FREESHIP, NEWUSER
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#374151' }}>
                  <span>Tạm tính ({items.length} sản phẩm)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#16a34a', fontWeight: 600 }}>
                    <span>Giảm giá ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#374151' }}>
                  <span>Phí vận chuyển</span>
                  <span style={isFreeShipping ? { color: '#16a34a', fontWeight: 600 } : {}}>
                    {isFreeShipping ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 18, color: '#0f172a', borderTop: '1px solid #e5e7eb', paddingTop: 10 }}>
                  <span>Tổng cộng</span>
                  <span style={{ color: '#2563eb' }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: 'pointer',
                  marginBottom: 10,
                  transition: 'opacity 0.15s',
                }}
              >
                Tiến hành thanh toán →
              </button>

              <Link
                to="/products"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
