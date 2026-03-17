import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";


const logoImage = ""; 

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  // Style để ép icon và chữ nằm trên 1 dòng
  const flexRowStyle = { 
    display: "flex", 
    alignItems: "center", 
    gap: "6px", 
    whiteSpace: "nowrap" 
  };

  return (
    <header className="header">
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="brand">
          <div className="brand__logo">
            {logoImage ? (
              <img src={logoImage} alt="FivePigs Store" style={{ width: 28, height: 28 }} />
            ) : (
              "🐷"
            )}
          </div>
          <div>FivePigs Store</div>
        </Link>

        {/* Search */}
        <div className="search">
          <form onSubmit={handleSearch} className="search__box">
            <span className="search__icon">🔎</span>
            <input
              className="search__input"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Navigation */}
        <nav className="header__actions">
          {user ? (
            <>
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                Xin chào, {user.name}
              </span>

              {isAdmin ? (
                <button className="btn" onClick={() => navigate("/admin")} style={flexRowStyle}>
                  <LayoutDashboard size={18} />
                  Admin
                </button>
              ) : (
                <>
                  <button className="btn" onClick={() => navigate("/cart")} style={{...flexRowStyle, position: "relative" }}>
                    <ShoppingCart size={18} />
                    Giỏ hàng
                    {totalItems > 0 && <span className="cartBadge">{totalItems}</span>}
                  </button>

                  <button className="btn" onClick={() => navigate("/orders")} style={flexRowStyle}>
                    <User size={18}/>
                    Đơn hàng
                  </button>
                </>
              )}

              <button className="btn" onClick={handleLogout} style={flexRowStyle}>
                <LogOut size={18} />
                Đăng xuất
              </button>
            </>
          ) : (
            <button className="btn btn--primary" onClick={() => navigate("/login")} style={flexRowStyle}>
              <User size={18} />
              Đăng nhập
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}