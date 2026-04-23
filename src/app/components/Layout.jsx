import { Outlet, Link } from "react-router-dom";
import { Header } from "./Header";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

export function Layout() {
  return (
    <div className="app">
      <Header />

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(99,102,241,0.2)',
                  display: 'grid', placeItems: 'center', fontSize: 18,
                }}>
                  🐷
                </div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>FivePigs Store</h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7, margin: '0 0 16px' }}>
                Thời trang hiện đại, chất lượng cao cấp. Phong cách của bạn bắt đầu từ đây.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: <Facebook size={16} />, href: '#' },
                  { icon: <Instagram size={16} />, href: '#' },
                  { icon: <Youtube size={16} />, href: '#' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(255,255,255,0.08)',
                      display: 'grid', placeItems: 'center',
                      color: '#9ca3af',
                      transition: 'all 0.15s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#9ca3af'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ margin: '0 0 14px', color: '#fff', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                Danh mục
              </h4>
              {[
                { label: 'Áo Thun', to: '/products?category=T-Shirts' },
                { label: 'Áo Sơ Mi', to: '/products?category=Shirts' },
                { label: 'Quần Jeans', to: '/products?category=Jeans' },
                { label: 'Hoodie & Áo Khoác', to: '/products?category=Hoodies' },
                { label: 'Váy & Đầm', to: '/products?category=Dresses' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ display: 'block', color: '#9ca3af', fontSize: 14, marginBottom: 8, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Support */}
            <div>
              <h4 style={{ margin: '0 0 14px', color: '#fff', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                Hỗ trợ
              </h4>
              {[
                { label: 'Chính sách đổi trả', to: '#' },
                { label: 'Hướng dẫn chọn size', to: '#' },
                { label: 'Theo dõi đơn hàng', to: '/orders' },
                { label: 'Câu hỏi thường gặp', to: '#' },
              ].map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{ display: 'block', color: '#9ca3af', fontSize: 14, marginBottom: 8, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ margin: '0 0 14px', color: '#fff', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                Liên hệ
              </h4>
              {[
                { icon: <Phone size={14} />, text: '1900-FIVEPIGS' },
                { icon: <Mail size={14} />, text: 'support@fivepigs.com' },
                { icon: <MapPin size={14} />, text: 'TP. Hồ Chí Minh, Việt Nam' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#9ca3af', fontSize: 14 }}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}

              {/* Newsletter */}
              <div style={{ marginTop: 16 }}>
                <p style={{ color: '#d1d5db', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
                  Nhận ưu đãi qua email
                </p>
                <div style={{ display: 'flex', gap: 0, overflow: 'hidden', borderRadius: 8 }}>
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRight: 'none',
                      color: '#fff',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <button
                    style={{
                      padding: '10px 14px',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container footer__bottom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span>© 2026 FivePigs Store. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
              <Link to="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Điều khoản dịch vụ</Link>
              <Link to="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Chính sách bảo mật</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}