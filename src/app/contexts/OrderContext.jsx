import { createContext, useContext, useEffect, useState } from 'react';

const OrderContext = createContext();

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  SHIPPING: 'Shipping',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('fivepigs_orders');
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('fivepigs_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: orderData.status || ORDER_STATUS.PENDING
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const getUserOrders = (userId) => {
    return orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getOrder = (orderId) => orders.find((o) => o.id === orderId);

  const cancelOrder = (orderId) => updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, getUserOrders, getOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
}
