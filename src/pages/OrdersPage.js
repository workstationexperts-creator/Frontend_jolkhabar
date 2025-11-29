import React, { useEffect, useState } from "react";
import { getMyOrders } from "../api/apiService";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="orders-msg">Loading your orders...</p>;

  if (orders.length === 0)
    return <p className="orders-msg">You have not placed any orders yet.</p>;

  return (
    <div className="orders-page-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-row">
            <strong>Order ID:</strong> #{order.id}
          </div>

          <div className="order-row">
            <strong>Status:</strong>{" "}
            <span className={`order-status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <div className="order-row">
            <strong>Order Date:</strong>{" "}
            {new Date(order.orderDate).toLocaleString()}
          </div>

          <div className="order-row">
            <strong>Total Amount:</strong> ₹{order.totalPrice}
          </div>

          <div className="order-row">
            <strong>Items:</strong> {order.items.length}
          </div>

          {order.shiprocketTrackingUrl && (
            <a
              href={order.shiprocketTrackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="track-btn"
            >
              Track Shipment
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
