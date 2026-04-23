import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../contexts/ProductContext";
import { TrendingUp, Shield, Truck, CreditCard, Star, ChevronRight, Tag } from "lucide-react";
import "../styles/home.css";

export function Home() {
  const { products, categories, loading } = useProducts();
  
  const safeProducts = Array.isArray(products) ? products : [];
  const featuredProducts = safeProducts.slice(0, 6);
  // Lấy sản phẩm mới nhất (đảo ngược danh sách)
  const newArrivals = [...safeProducts].reverse().slice(0, 4);
  // Best sellers theo đánh giá cao nhất
  const bestSellers = [...safeProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Đang tải FivePigs Store...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg"></div>
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__badge">🔥 Bộ sưu tập mới 2026</span>
            <h1 className="hero__title">Phong cách của bạn<br /><span className="hero__title-accent">bắt đầu từ đây</span></h1>
            <p className="hero__sub">Thời trang hiện đại, chất lượng cao cấp — Miễn phí vận chuyển đơn từ 500k</p>
            <div className="hero__actions">
              <Link to="/products" className="hero__btn hero__btn--primary">
                Mua sắm ngay
                <ChevronRight size={18} />
              </Link>
              <Link to="/products?category=Jackets" className="hero__btn hero__btn--outline">
                Áo khoác hot
              </Link>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__img-wrap">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80"
                alt="Fashion"
                className="hero__img"
              />
              <div className="hero__img-badge">
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>4.9 / 5.0 đánh giá</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="sale-banner">
        <div className="container">
          <div className="sale-banner__inner">
            <Tag size={24} color="#fff" />
            <span>🎉 SALE MÙA HÈ — Giảm đến <strong>40%</strong> các sản phẩm Áo Thun, Váy!</span>
            <Link to="/products?category=T-Shirts" className="sale-banner__btn">
              Xem ưu đãi →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container features__grid">
          <div className="feature">
            <div className="feature__icon"><Truck /></div>
            <div>
              <h3>Giao hàng miễn phí</h3>
              <p>Đơn hàng trên 500.000đ</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature__icon"><Shield /></div>
            <div>
              <h3>Đảm bảo chất lượng</h3>
              <p>Hoàn tiền 100% nếu lỗi</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature__icon"><CreditCard /></div>
            <div>
              <h3>Thanh toán an toàn</h3>
              <p>Bảo mật thông tin tuyệt đối</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature__icon"><TrendingUp /></div>
            <div>
              <h3>Xu hướng mới nhất</h3>
              <p>Cập nhật liên tục mỗi tuần</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <h2>Sản phẩm nổi bật</h2>
              <p>Được yêu thích nhất tại FivePigs Store</p>
            </div>
            <Link to="/products" className="section__more">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className="products__grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section section--alt">
        <div className="container">
          <div className="section__head">
            <div>
              <h2>🆕 Hàng mới về</h2>
              <p>Những sản phẩm vừa được thêm vào cửa hàng</p>
            </div>
            <Link to="/products" className="section__more">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className="products__grid products__grid--4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <h2>Danh mục sản phẩm</h2>
              <p>Tìm kiếm theo danh mục yêu thích của bạn</p>
            </div>
          </div>
          <div className="categories__grid">
            {Array.isArray(categories) && categories.length > 0 && categories.map((category) => {
              const catName = category.name || category;
              const catId = category.id || category;
              const catEmojis = {
                'T-Shirts': '👕',
                'Shirts': '👔',
                'Jeans': '👖',
                'Pants': '🩲',
                'Hoodies': '🧥',
                'Jackets': '🥼',
                'Dresses': '👗',
                'Skirts': '🩱',
              };
              return (
                <Link
                  key={catId}
                  to={`/products?category=${encodeURIComponent(catName)}`}
                  className="category__item"
                >
                  <span className="category__emoji">{catEmojis[catName] || '🛍️'}</span>
                  <span>{catName}</span>
                  <span className="category__count">
                    {products.filter(p => p.category === catName).length} sản phẩm
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section section--alt">
        <div className="container">
          <div className="section__head">
            <div>
              <h2>⭐ Bán chạy nhất</h2>
              <p>Được khách hàng đánh giá cao nhất</p>
            </div>
            <Link to="/products" className="section__more">
              Xem thêm <ChevronRight size={16} />
            </Link>
          </div>
          <div className="products__grid products__grid--4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <div className="section__head">
            <div>
              <h2>Khách hàng nói gì?</h2>
              <p>Hàng nghìn khách hàng hài lòng với FivePigs Store</p>
            </div>
          </div>
          <div className="testimonials__grid">
            {[
              { name: "Nguyễn Thị Lan", rating: 5, text: "Chất lượng vải rất tốt, form đẹp đúng chuẩn. Mình đã mua 3 lần và lần nào cũng hài lòng!", avatar: "L" },
              { name: "Trần Văn Minh", rating: 5, text: "Giao hàng nhanh, đóng gói cẩn thận. Áo hoodie mua về mặc rất ấm và đẹp, sẽ ủng hộ lâu dài!", avatar: "M" },
              { name: "Lê Thị Hoa", rating: 5, text: "Shop tư vấn nhiệt tình, size chuẩn như mô tả. Váy nhận được đẹp hơn ảnh nhiều luôn!", avatar: "H" },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.avatar}</div>
                  <span>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Sẵn sàng nâng cấp phong cách?</h2>
          <p>Đăng ký ngay để nhận ưu đãi 10% cho đơn hàng đầu tiên!</p>
          <Link to="/login" className="cta-btn">
            Đăng ký tài khoản
          </Link>
        </div>
      </section>
    </div>
  );
}