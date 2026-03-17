import { useState } from "react";
import { useOrders } from "../contexts/OrderContext";

export function Orders() {
  const { orders, cancelOrder } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price) || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${month}/${day} at ${hour}:${minute}`;
  };

  const handleCancelOrder = async (orderId) => {
    const ok = window.confirm("Bạn có chắc muốn hủy đơn hàng này không?");
    if (!ok) return;

    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error("Cancel order failed:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>

      <div className="mb-6">
        <label className="mr-3 font-medium">Lọc theo trạng thái:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="All">Tất cả</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Không có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-semibold">Mã đơn: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    Ngày đặt: {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>

                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium">{item.product?.name}</h3>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>

                      <div className="font-semibold">
                        {formatPrice((item.product?.price || 0) * (item.quantity || 0))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <p className="text-lg font-bold">
                    Tổng cộng: {formatPrice(order.totalPrice)}
                  </p>
                </div>

                {order.shippingInfo && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Thông tin giao hàng</h4>
                    <p>{order.shippingInfo.name}</p>
                    <p>{order.shippingInfo.phone}</p>
                    <p>
                      {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                      {order.shippingInfo.postalCode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}