import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, LayoutDashboard, NotebookPen, Heart, Menu, X, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useState } from "react";

const logoImage = "";

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { label: "Trang chủ", to: "/" },
    { label: "Sản phẩm", to: "/products" },
  ];

  return (
    <header className="header">
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <div className="brand__logo">
            {logoImage ? (
              <img src={logoImage} alt="FivePigs Store" style={{ width: 28, height: 28 }} />
            ) : (
              "🐷"
            )}
          </div>
          <div>FivePigs Store</div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="header__nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__nav-link ${location.pathname === link.to ? "header__nav-link--active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="search">
          <form onSubmit={handleSearch} className="search__box">
            <span className="search__icon"><Search size={16} /></span>
            <input
              className="search__input"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Actions */}
        <nav className="header__actions">
          {user ? (
            <>
              <span className="header__greeting">
                Xin chào, {user.name}
              </span>

              {isAdmin ? (
                <button className="btn" onClick={() => navigate("/admin")}>
                  <LayoutDashboard size={18} style={{ marginRight: 8 }} />
                  Admin
                </button>
              ) : (
                <>
                  {/* Wishlist */}
                  <button
                    className="btn header__icon-btn"
                    onClick={() => navigate("/wishlist")}
                    title="Yêu thích"
                    style={{ position: "relative" }}
                  >
                    <Heart size={18} />
                    {totalWishlist > 0 && (
                      <span className="cartBadge">{totalWishlist}</span>
                    )}
                  </button>

                  {/* Cart */}
                  <button
                    className="btn header__icon-btn"
                    onClick={() => navigate("/cart")}
                    title="Giỏ hàng"
                    style={{ position: "relative" }}
                  >
                    <ShoppingCart size={18} />
                    {totalItems > 0 && (
                      <span className="cartBadge">{totalItems}</span>
                    )}
                  </button>

                  <button className="btn" onClick={() => navigate("/orders")}>
                    <NotebookPen size={18} style={{ marginRight: 6 }} />
                    Đơn hàng
                  </button>

                  <button className="btn header__icon-btn" onClick={() => navigate("/profile")} title="Hồ sơ">
                    <User size={18} />
                  </button>
                </>
              )}

              <button className="btn header__icon-btn" onClick={handleLogout} title="Đăng xuất">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn header__icon-btn"
                onClick={() => navigate("/cart")}
                title="Giỏ hàng"
                style={{ position: "relative" }}
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="cartBadge">{totalItems}</span>
                )}
              </button>
              <button
                className="btn btn--primary"
                onClick={() => navigate("/login")}
              >
                <User size={18} style={{ marginRight: 8 }} />
                Đăng nhập
              </button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="btn header__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-menu__search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Tìm</button>
          </form>
          <div className="mobile-menu__links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="mobile-menu__link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && !isAdmin && (
              <>
                <Link to="/wishlist" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                  ❤️ Yêu thích {totalWishlist > 0 && `(${totalWishlist})`}
                </Link>
                <Link to="/cart" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                  🛒 Giỏ hàng {totalItems > 0 && `(${totalItems})`}
                </Link>
                <Link to="/orders" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                  📦 Đơn hàng
                </Link>
                <Link to="/profile" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                  👤 Hồ sơ
                </Link>
              </>
            )}
            {user ? (
              <button className="mobile-menu__link mobile-menu__logout" onClick={handleLogout}>
                🚪 Đăng xuất
              </button>
            ) : (
              <Link to="/login" className="mobile-menu__link" onClick={() => setMobileOpen(false)}>
                🔐 Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
