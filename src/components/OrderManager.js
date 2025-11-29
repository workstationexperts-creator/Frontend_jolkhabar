// src/components/OrderManager.js
import React, { useEffect, useState } from "react";
import { getAllOrders } from "../api/apiService";
import "./OrderManager.css";

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchQuery, statusFilter]);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();

            const sortedOrders = [...data].sort(
                (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
            );

            setOrders(sortedOrders);
            setFilteredOrders(sortedOrders);
        } catch (error) {
            console.error("❌ Error loading orders:", error);
            alert("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let updated = [...orders];

        if (statusFilter !== "ALL") {
            updated = updated.filter(order => order.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            updated = updated.filter(order => {
                const addr = order.shippingAddress;
                return (
                    (addr?.recipientName?.toLowerCase().includes(query)) ||
                    (addr?.phoneNumber?.toLowerCase().includes(query)) ||
                    order.totalPrice.toString().includes(query) ||
                    order.id.toString().includes(query)
                );
            });
        }

        setFilteredOrders(updated);
    };

    if (loading) return <p>Loading orders...</p>;

    if (!filteredOrders.length) return <p>No orders found</p>;

    return (
        <div className="orders-container">
            <h3>Manage Orders</h3>

            {/* 🔍 Search & Filter Section */}
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Search by customer / phone / amount"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-dropdown"
                >
                    <option value="ALL">All Status</option>
                    {/* <option value="PENDING">Pending</option> */}
                    <option value="PAID">Paid</option>
                    {/* <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option> */}
                </select>
            </div>

            {/* Orders Table */}
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Order Date</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredOrders.map((order, index) => {
                        const addr = order.shippingAddress;
                        return (
                            <tr key={order.id}>
                                <td>{index + 1}</td>
                                <td>{addr?.recipientName}</td>
                                <td>{addr?.phoneNumber}</td>
                                <td>
                                    {addr?.street}, {addr?.city}, {addr?.state} - {addr?.postalCode}
                                </td>
                                <td>{order.items?.length}</td>
                                <td>₹{order.totalPrice}</td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default OrderManager;
