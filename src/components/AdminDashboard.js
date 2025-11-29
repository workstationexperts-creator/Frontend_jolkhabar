import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import CategoryManager from './CategoryManager';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import './AdminDashboard.css';

const AdminDashboard = ({ api, token }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Read active tab from URL
  const params = new URLSearchParams(location.search);
  const tabFromUrl = params.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Sync tab when URL changes
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  // Update URL when tab is switched
  const switchTab = (tab) => {
    navigate(`/admin-dashboard?tab=${tab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders': return <OrderManager api={api} token={token} />;
      case 'products': return <ProductManager api={api} token={token} />;
      case 'categories': return <CategoryManager api={api} token={token} />;
      default: return <OrderManager api={api} token={token} />;
    }
  };

  return (
    <div className="container page-content">
      <h2 className="page-title">Admin Dashboard</h2>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => switchTab('orders')}
        >
          📦 Manage Orders
        </button>

        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => switchTab('products')}
        >
          🧺 Manage Products
        </button>

        <button
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => switchTab('categories')}
        >
          🏷️ Manage Categories
        </button>
      </div>

      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
