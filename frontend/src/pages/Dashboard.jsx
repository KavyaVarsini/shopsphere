import { useState, useEffect } from "react";
import api from "../api/api";
import socket from "../socket/socket";
import MonthlySales from "../components/MonthlySales";
import TopCustomers from "../components/TopCustomers";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const revenueRes = await api.get("/analytics/revenue", { headers });
      const salesRes = await api.get("/analytics/monthly-sales", { headers });
      const customersRes = await api.get("/analytics/top-customers", { headers });

      setTotalRevenue(revenueRes.data.totalRevenue);
      setMonthlySales(salesRes.data);
      setTopCustomers(customersRes.data);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const ParticleBackground = () => (
  <div className="particles-container">
    {[...Array(20)].map((_, i) => (
      <div key={i} className="particle" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
      }} />
    ))}
  </div>
);

  useEffect(() => {
    loadDashboard();

    socket.on("new-order", () => {
      console.log("🔥 new order received");
      loadDashboard();
    });

    return () => socket.off("new-order");
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Shopsphere Analytics Dashboard</h1>
        <p className="dashboard-subtitle">Premium insights with real-time updates</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Revenue Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Revenue</h3>
            <div className="stat-icon-container revenue-icon">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="stat-value gold-text">
            ₹ {totalRevenue.toLocaleString()}
          </div>
          <p className="stat-description">All-time completed orders</p>
        </div>

        {/* Orders Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Monthly Orders</h3>
            <div className="stat-icon-container orders-icon">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="stat-value gold-text">
            {monthlySales.reduce((sum, month) => sum + (month.totalSales > 0 ? 1 : 0), 0)}
          </div>
          <p className="stat-description">Active sales months</p>
        </div>

        {/* Customers Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Top Customers</h3>
            <div className="stat-icon-container customers-icon">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="stat-value gold-text">
            {topCustomers.length}
          </div>
          <p className="stat-description">High-value customers</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Sales Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Sales Performance</h3>
            <span className="chart-badge">Live Updates</span>
          </div>
          <div className="chart-content">
            <MonthlySales data={monthlySales} />
          </div>
        </div>

        {/* Top Customers List */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Top Customers by Spending</h3>
            <span className="chart-badge">Royal Ranking</span>
          </div>
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {topCustomers.length > 0 ? (
              topCustomers.map((customer, index) => (
                <div key={index} className="customer-item">
                  <div className="customer-info">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="customer-avatar">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ marginLeft: '1rem' }}>
                        <h4 className="customer-name">{customer.name}</h4>
                        <p className="customer-id">Rank #{index + 1}</p>
                      </div>
                    </div>
                  </div>
                  <div className="customer-amount">
                    <div className="customer-total">₹ {customer.totalSpent.toLocaleString()}</div>
                    <div className="customer-label">Total spent</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="empty-text">No customer data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="live-indicator">
        <div className="live-dot"></div>
        <span className="live-text">Live data streaming active</span>
      </div>
    </div>
  );
};

export default Dashboard;