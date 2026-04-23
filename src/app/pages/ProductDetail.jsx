import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Star, ShoppingCart, Package, Truck, Shield, Heart, ChevronRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const product = getProduct(id);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const wishlisted = product ? isWishlisted(product.id) : false;

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Không tìm thấy sản phẩm</h2>
          <button
            onClick={() => navigate('/products')}
            style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            ← Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Vui lòng chọn kích thước');
      return;
    }
    if (quantity > product.stock) {
      toast.error('Số lượng vượt quá hàng có sẵn');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để mua hàng');
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Vui lòng chọn kích thước');
      return;
    }
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    if (added) toast.success('Đã thêm vào danh sách yêu thích!');
    else toast.info('Đã xóa khỏi danh sách yêu thích');
  };

  // Related products (same category, exclude current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Trang chủ</Link>
          <ChevronRight size={14} />
          <Link to="/products" style={{ color: '#6b7280', textDecoration: 'none' }}>Sản phẩm</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: '#6b7280', textDecoration: 'none' }}>
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Content */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: 32,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {/* Product Image */}
            <div style={{ position: 'relative', background: '#f8fafc' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 450 }}
              />
              {product.stock === 0 && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    background: '#ef4444',
                    color: '#fff',
                    padding: '10px 24px',
                    borderRadius: 12,
                    fontSize: 18,
                    fontWeight: 800,
                  }}>
                    Hết hàng
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ padding: '36px 40px' }}>
              <div style={{ marginBottom: 12 }}>
                <Link
                  to={`/products?category=${encodeURIComponent(product.category)}`}
                  style={{
                    display: 'inline-block',
                    background: '#eff6ff',
                    color: '#2563eb',
                    padding: '4px 12px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                    marginBottom: 12,
                  }}
                >
                  {product.category}
                </Link>
                <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 12px', color: '#0f172a', lineHeight: 1.2 }}>
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                      color={i < Math.floor(product.rating) ? '#f59e0b' : '#d1d5db'}
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{product.rating}</span>
                <span style={{ color: '#6b7280', fontSize: 14 }}>({product.reviews} đánh giá)</span>
                {product.stock > 0 && (
                  <span style={{
                    background: '#f0fdf4',
                    color: '#16a34a',
                    padding: '2px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    Còn {product.stock} sản phẩm
                  </span>
                )}
              </div>

              {/* Price */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 34, fontWeight: 900, color: '#2563eb', margin: 0 }}>
                  {formatPrice(product.price)}
                </p>
              </div>

              <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>
                {product.description}
              </p>

              {/* Size Selection */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: 10, color: '#0f172a' }}>
                  Chọn kích thước: {selectedSize && <span style={{ color: '#2563eb' }}>{selectedSize}</span>}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '10px 18px',
                        border: '2px solid',
                        borderColor: selectedSize === size ? '#2563eb' : '#e5e7eb',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 14,
                        background: selectedSize === size ? '#eff6ff' : '#fff',
                        color: selectedSize === size ? '#2563eb' : '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontWeight: 800, marginBottom: 10, color: '#0f172a' }}>Số lượng:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '10px 16px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 18 }}
                  >
                    −
                  </button>
                  <span style={{ padding: '10px 20px', fontWeight: 800, fontSize: 16, minWidth: 48, textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ padding: '10px 16px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 18 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    background: product.stock === 0 ? '#e5e7eb' : '#fff',
                    color: product.stock === 0 ? '#9ca3af' : '#2563eb',
                    border: '2px solid',
                    borderColor: product.stock === 0 ? '#e5e7eb' : '#2563eb',
                    padding: '14px',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.15s',
                  }}
                >
                  <ShoppingCart size={18} />
                  {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    background: product.stock === 0 ? '#e5e7eb' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.15s',
                  }}
                >
                  <Zap size={18} />
                  Mua ngay
                </button>

                <button
                  onClick={handleWishlist}
                  style={{
                    width: 52,
                    background: wishlisted ? '#fff5f5' : '#fff',
                    color: wishlisted ? '#ef4444' : '#6b7280',
                    border: '2px solid',
                    borderColor: wishlisted ? '#fecaca' : '#e5e7eb',
                    borderRadius: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                >
                  <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ textAlign: 'center' }}>
                  <Package size={22} style={{ margin: '0 auto 6px', color: '#2563eb' }} />
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0, fontWeight: 600 }}>Miễn phí đổi trả</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Truck size={22} style={{ margin: '0 auto 6px', color: '#2563eb' }} />
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0, fontWeight: 600 }}>Giao hàng nhanh</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Shield size={22} style={{ margin: '0 auto 6px', color: '#2563eb' }} />
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0, fontWeight: 600 }}>Hàng chính hãng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: '#0f172a' }}>
                Sản phẩm tương tự
              </h2>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}
              >
                Xem thêm →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
