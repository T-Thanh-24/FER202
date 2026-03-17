import { createContext, useContext, useEffect, useState } from 'react';
import { OrderService } from '../services/OrderService';

const OrderContext = createContext();

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Load orders failed:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const createOrder = async (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: orderData.status || ORDER_STATUS.PENDING,
    };

    const created = await OrderService.createOrder(newOrder);
    setOrders((prev) => [...prev, created]);
    return created.id;
  };

  const updateOrderStatus = async (orderId, status) => {
    await OrderService.updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const getUserOrders = (userId) => {
    return orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getOrder = (orderId) => orders.find((o) => o.id === orderId);

  const cancelOrder = (orderId) => updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);

  return (
    <OrderContext.Provider
      value={{
        loading,
        orders,
        loadOrders,
        createOrder,
        updateOrderStatus,
        getUserOrders,
        getOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return ctx;
}