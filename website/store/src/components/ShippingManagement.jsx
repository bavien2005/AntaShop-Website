import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './ShippingManagement.css';

export default function ShippingManagement({ onDataChange }) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchOrder, setSearchOrder] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusFilters = [
    { id: 'all', label: 'Tất cả', count: 0 },
    { id: 'unpaid', label: 'Chưa thanh toán', count: 0 },
    { id: 'needs-shipping', label: 'Cần gửi', count: 0 },
    { id: 'sent', label: 'Đã gửi', count: 0 },
    { id: 'completed', label: 'Hoàn thành', count: 0 },
    { id: 'cancelled', label: 'Hủy bỏ', count: 0 },
    { id: 'return', label: 'Trả hàng', count: 0 }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const handleOrderUpdate = (event) => {
      loadOrders();
    };

    const handleOrderCancelled = (event) => {
      loadOrders();
    };

    const handleStorageChange = (e) => {
      if (e.key === 'anta_admin_orders') {
        loadOrders();
      }
    };

    window.addEventListener('data:orders', handleOrderUpdate);
    window.addEventListener('orderCancelled', handleOrderCancelled);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('data:orders', handleOrderUpdate);
      window.removeEventListener('orderCancelled', handleOrderCancelled);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const result = await adminService.orders.getOrders();
    if (result.success) {
      setOrders(result.data);
      setFilteredOrders(result.data);
    } else {
      alert('Không thể tải danh sách đơn hàng');
    }
    setLoading(false);
  };

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      unpaid: 0,
      'needs-shipping': 0,
      sent: 0,
      completed: 0,
      cancelled: 0,
      return: 0
    };

    orders.forEach(order => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });

    return statusFilters.map(filter => ({
      ...filter,
      count: counts[filter.id] || 0
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    const result = await adminService.orders.getOrders({
      search: searchOrder,
      status: selectedStatus
    });
    if (result.success) {
      setFilteredOrders(result.data);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSearchOrder('');
    setSelectedStatus('all');
    setFilteredOrders(orders);
  };

  const handleStatusChange = async (statusId) => {
    setSelectedStatus(statusId);
    setLoading(true);
    const result = await adminService.orders.getOrders({
      status: statusId
    });
    if (result.success) {
      setFilteredOrders(result.data);
    }
    setLoading(false);
  };

  const handleArrangeShipping = async (orderId) => {
    const shippingData = {
      service: 'J&T Express',
      trackingNumber: 'JT' + Date.now(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')
    };

    const result = await adminService.orders.arrangeShipping(orderId, shippingData);
    if (result.success) {
      alert(result.message);
      await loadOrders();
      if (onDataChange) onDataChange();
    } else {
      alert(result.error || 'Không thể sắp xếp giao hàng');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const result = await adminService.orders.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      alert(result.message);
      await loadOrders();
      if (onDataChange) onDataChange();
    } else {
      alert(result.error || 'Không thể cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'all': { label: 'Tất cả', class: '' },
      'unpaid': { label: 'Chưa thanh toán', class: 'unpaid' },
      'needs-shipping': { label: 'Cần gửi', class: 'needs-shipping' },
      'sent': { label: 'Đang giao', class: 'sent' },
      'completed': { label: 'Hoàn thành', class: 'completed' },
      'cancelled': { label: 'Hủy bỏ', class: 'cancelled' },
      'return': { label: 'Trả hàng', class: 'return' }
    };
    return statusMap[status] || statusMap['all'];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="shipping-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-management">
      <div className="shipping-management-content">
        <div className="page-header-section">
          <h1 className="page-main-title">Quản Lý Vận Chuyển</h1>
          <p className="page-subtitle">Quản lý tất cả đơn hàng và vận chuyển</p>
        </div>

        <div className="status-filters-section">
          {getStatusCounts().map((filter) => (
            <button
              key={filter.id}
              className={`status-filter-btn ${selectedStatus === filter.id ? 'active' : ''}`}
              onClick={() => handleStatusChange(filter.id)}
            >
              <span className="filter-label">{filter.label}</span>
              {filter.count > 0 && (
                <span className="filter-count">{filter.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="search-filters-card">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-order-input"
              placeholder="Nhập số đơn hàng hoặc tên khách hàng..."
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <span className="search-input-icon">🔍</span>
          </div>
          
          <div className="search-actions-row">
            <button className="search-action-btn primary" onClick={handleSearch}>
              <span className="btn-icon">🔍</span>
              Tìm kiếm
            </button>
            <button className="search-action-btn secondary" onClick={handleReset}>
              <span className="btn-icon">↻</span>
              Đặt lại
            </button>
            <div className="total-orders-info">
              <span className="orders-count">{filteredOrders.length}</span> đơn hàng
            </div>
          </div>
        </div>

        <div className="orders-list-section">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders-state">
              <span className="empty-orders-icon">📦</span>
              <p className="empty-orders-title">Không tìm thấy đơn hàng</p>
              <p className="empty-orders-description">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info-left">
                    <div className="customer-name-section">
                      <span className="customer-icon">👤</span>
                      <span className="customer-name">{order.customer}</span>
                    </div>
                    <div className="order-meta">
                      <span className="order-number-label">Số đơn hàng:</span>
                      <span className="order-number-value">{order.orderNumber}</span>
                      <span className="order-date">• {order.date}</span>
                    </div>
                  </div>
                  <div className="order-info-right">
                    <div className="order-total-section">
                      <span className="total-label">Tổng cộng:</span>
                      <span className="total-value">{formatCurrency(order.total)}</span>
                    </div>
                    <span className={`order-status-badge ${order.status}`}>
                      {getStatusBadge(order.status).label}
                    </span>
                  </div>
                </div>
                
                <div className="order-products-list">
                  {(order.products && order.products.length > 0) ? (
                    order.products.map((product, index) => (
                      <div key={`${product.id}-${index}`} className="order-product-row">
                        <div className="product-main-info">
                          <img
                            src={product.image || 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={product.name}
                            className="product-order-thumbnail"
                          />
                          <div className="product-order-details">
                            <h4 className="product-order-name">{product.name}</h4>
                            <p className="product-order-price">
                              {formatCurrency(product.price)} × {product.quantity || 1}
                            </p>
                          </div>
                        </div>

                        <div className="product-shipping-info">
                          <div className="shipping-status-section">
                            <span className="shipping-status-label">Trạng thái:</span>
                            <span className={`shipping-status-text ${order.status}`}>
                              {product.dueDate || 'Chưa xác định'}
                            </span>
                          </div>
                          <div className="shipping-service-section">
                            <span className="shipping-service-icon">🚚</span>
                            <span className="shipping-service-name">{product.shippingService || 'Chờ xử lý'}</span>
                          </div>
                        </div>

                        <div className="product-quantity-section">
                          <span className="quantity-label">SL:</span>
                          <span className="quantity-value">{product.quantity || 1}</span>
                        </div>

                        <div className="product-actions-section">
                          {order.status === 'needs-shipping' && (
                            <button
                              className="arrange-shipping-button"
                              onClick={() => handleArrangeShipping(order.id)}
                            >
                              <span className="btn-icon">📦</span>
                              Sắp xếp giao hàng
                            </button>
                          )}
                          {order.status === 'sent' && (
                            <button
                              className="complete-order-button"
                              onClick={() => handleUpdateStatus(order.id, 'completed')}
                            >
                              <span className="btn-icon">✓</span>
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="order-product-row">
                      <div className="product-main-info">
                        <div className="product-order-details">
                          <p className="product-order-name">Không có thông tin sản phẩm</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
