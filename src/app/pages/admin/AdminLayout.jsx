import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, FolderTree, BarChart3, LogOut } from 'lucide-react';
// TODO: replace figma asset with local file
const logoImage = '';
export function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || !isAdmin) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
  { path: "/admin", label: "Dashboard" },
  { path: "/admin/products", label: "Products" },
  { path: "/admin/orders", label: "Orders" },
  { path: "/admin/categories", label: "Categories" },
  { path: "/admin/reports", label: "Reports" },
];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="FivePigs Store" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-blue-600">FivePigs Store Admin</h1>
              <p className="text-sm text-gray-600">Quản lý hệ thống</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Admin: {user.name}</span>
            <Link
              to="/"
              className="text-sm text-blue-600 hover:underline"
            >
              Về trang chủ
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
