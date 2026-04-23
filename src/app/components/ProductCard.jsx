import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { toast } from "sonner";

export function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) toast.success(`Đã thêm "${product.name}" vào yêu thích!`);
    else toast.info(`Đã xóa khỏi danh sách yêu thích`);
  };

  return (
    <div className="product-card">
      <div style={{ position: "relative" }}>
        <Link to={`/products/${product.id}`} className="product-card__thumb">
          <img
            src={product.image}
            alt={product.name}
            className="product-card__img"
          />
        </Link>
        {product.stock === 0 && (
          <span className="product-card__sold-out">Hết hàng</span>
        )}
        <button
          className={`product-card__wishlist ${wishlisted ? "product-card__wishlist--active" : ""}`}
          onClick={handleWishlist}
          title={wishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-card__body">
        <div className="product-card__top">
          <span className="product-card__tag">{product.category}</span>
          <div className="product-card__rating">
            <Star className="product-card__star" />
            <span>{product.rating}</span>
            <span style={{ color: "#9ca3af", fontSize: 11 }}>({product.reviews})</span>
          </div>
        </div>

        <Link to={`/products/${product.id}`} className="product-card__name">
          {product.name}
        </Link>

        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__bottom">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <Link
            to={`/products/${product.id}`}
            className={`product-card__btn ${product.stock === 0 ? "product-card__btn--disabled" : ""}`}
          >
            <ShoppingCart className="product-card__btn-icon" />
            {product.stock === 0 ? "Hết hàng" : "Xem"}
          </Link>
        </div>
      </div>
    </div>
  );
}