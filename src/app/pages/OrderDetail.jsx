import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';

export function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getOrder, cancelOrder } = useOrders();
  const order = getOrder(id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
          <Link to="/orders" className="text-blue-600 hover:underline">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const handleCancelOrder = () => {
    // Đã thêm window. vào trước confirm để fix lỗi ESLint
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      cancelOrder(order.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/orders" className="text-blue-600 hover:underline">
            ← Quay lại danh sách đơn hàng
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Chi tiết đơn hàng</h1>
              <p className="text-gray-600">Mã đơn hàng: {order.id}</p>
              <p className="text-sm text-gray-500">Đặt ngày: {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full font-medium ${
                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-b py-6 mb-6">
            <h2 className="font-semibold mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} × {item.quantity}
                    </p>
                    <p className="text-blue-600 font-semibold mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mb-6">
            <h2 className="font-semibold mb-3">Thông tin giao hàng</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{order.shippingInfo.name}</p>
              <p className="text-sm text-gray-600">{order.shippingInfo.phone}</p>
              <p className="text-sm text-gray-600">
                {order.shippingInfo.address}, {order.shippingInfo.city}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-6">
            <h2 className="font-semibold mb-3">Phương thức thanh toán</h2>
            <p className="text-gray-700">
              {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thẻ tín dụng/Ghi nợ'}
            </p>
            <p className="text-sm text-gray-600">
              Trạng thái: {order.paymentStatus === 'Success' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </p>
          </div>

          {/* Total */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(order.totalPrice)}
              </span>
            </div>

            {order.status === 'Pending' && (
              <button
                onClick={handleCancelOrder}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}