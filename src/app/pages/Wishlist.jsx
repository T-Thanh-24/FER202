import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function Wishlist() {
  const { wishlist, removeFromWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id];
    if (!size) {
      toast.error('Vui lòng chọn kích thước trước!');
      return;
    }
    addToCart(product, size, 1);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="wishlist-empty__inner">
          <Heart size={80} strokeWidth={1} color="#e5e7eb" />
          <h2>Danh sách yêu thích trống</h2>
          <p>Thêm sản phẩm yêu thích để xem lại sau!</p>
          <Link to="/products" className="wishlist-empty__btn">
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-head">
          <Link to="/products" className="wishlist-back">
            <ArrowLeft size={18} />
            Tiếp tục mua sắm
          </Link>
          <div>
            <h1 className="wishlist-title">Sản phẩm yêu thích</h1>
            <p className="wishlist-sub">{wishlist.length} sản phẩm</p>
          </div>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-card">
              <div className="wishlist-card__img-wrap">
                <Link to={`/products/${product.id}`}>
                  <img src={product.image} alt={product.name} className="wishlist-card__img" />
                </Link>
                <button
                  className="wishlist-card__remove"
                  onClick={() => {
                    removeFromWishlist(product.id);
                    toast.info('Đã xóa khỏi yêu thích');
                  }}
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="wishlist-card__body">
                <span className="wishlist-card__category">{product.category}</span>
                <Link to={`/products/${product.id}`} className="wishlist-card__name">
                  {product.name}
                </Link>
                <p className="wishlist-card__price">{formatPrice(product.price)}</p>

                {/* Size select */}
                <div className="wishlist-card__sizes">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      className={`wishlist-size-btn ${selectedSizes[product.id] === size ? 'wishlist-size-btn--active' : ''}`}
                      onClick={() => setSelectedSizes({ ...selectedSizes, [product.id]: size })}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="wishlist-card__actions">
                  <button
                    className="wishlist-card__btn-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={16} />
                    Thêm vào giỏ
                  </button>
                  <button
                    className="wishlist-card__btn-remove"
                    onClick={() => {
                      removeFromWishlist(product.id);
                      toast.info('Đã xóa khỏi yêu thích');
                    }}
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
