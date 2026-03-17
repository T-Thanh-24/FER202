import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { ForgetPassword } from './pages/ForgetPassword';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { OrderDetail } from './pages/OrderDetail';
import { Orders } from './pages/Orders';
import { ProductDetail } from './pages/ProductDetail';
import { ProductReview } from './pages/ProductReview';
import { Products } from './pages/Products';
import { Profile } from './pages/Profile';

import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminReports } from './pages/admin/AdminReports';
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, Component: Home },
      { path: 'products', Component: Products },
      { path: 'products/:id', Component: ProductDetail },
      { path: 'products/:id/reviews', Component: ProductReview },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'orders', Component: Orders },
      { path: 'orders/:id', Component: OrderDetail },
      { path: 'login', Component: Login },
      { path: '*', Component: NotFound }
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "products", Component: AdminProducts },
      { path: "orders", Component: AdminOrders },
      { path: "categories", Component: AdminCategories },
      { path: "reports", Component: AdminReports },
    ],
  },
]);  