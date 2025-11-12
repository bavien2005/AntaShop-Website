import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts';
import { Layout } from '../components';
import './MegaSale.css';

export default function MegaSale() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set countdown target date (example: 3 days from now)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(23, 59, 59, 999);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeRemaining({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'shoes', name: 'Giày' },
    { id: 'clothing', name: 'Quần áo' },
    { id: 'accessories', name: 'Phụ kiện' }
  ];

  const saleProducts = [
    {
      id: 1,
      name: 'Giày Chạy Thể Thao Nam ANTA Running Pro',
      price: 1259100,
      originalPrice: 1399000,
      discount: 10,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'shoes',
      badge: 'HOT SALE'
    },
    {
      id: 2,
      name: 'Giày Chạy Thể Thao Nữ ANTA Speed',
      price: 1599000,
      originalPrice: 1999000,
      discount: 20,
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'shoes',
      badge: 'MEGA SALE'
    },
    {
      id: 3,
      name: 'Giày Thể Thao Nam ANTA Lifestyle',
      price: 1899000,
      originalPrice: 2199000,
      discount: 14,
      image: 'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'shoes',
      badge: 'FLASH SALE'
    },
    {
      id: 4,
      name: 'Giày Bóng Rổ ANTA Basketball Elite',
      price: 2199000,
      originalPrice: 2499000,
      discount: 12,
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'shoes',
      badge: 'HOT SALE'
    },
    {
      id: 5,
      name: 'Áo Thể Thao Nam ANTA Performance',
      price: 599000,
      originalPrice: 799000,
      discount: 25,
      image: 'https://images.pexels.com/photos/1232594/pexels-photo-1232594.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'clothing',
      badge: 'BEST DEAL'
    },
    {
      id: 6,
      name: 'Quần Short Thể Thao ANTA Training',
      price: 449000,
      originalPrice: 599000,
      discount: 25,
      image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'clothing',
      badge: 'MEGA SALE'
    },
    {
      id: 7,
      name: 'Giày Chạy ANTA Ultra Light',
      price: 1799000,
      originalPrice: 2099000,
      discount: 14,
      image: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'shoes',
      badge: 'HOT SALE'
    },
    {
      id: 8,
      name: 'Áo Khoác Thể Thao ANTA Windbreaker',
      price: 1359000,
      originalPrice: 1699000,
      discount: 20,
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'clothing',
      badge: 'FLASH SALE'
    },
    {
      id: 9,
      name: 'Giày Training ANTA Workout',
      price: 1499000,
      originalPrice: 1799000,
      discount: 17,
      image: 'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'shoes',
      badge: 'MEGA SALE'
    },
    {
      id: 10,
      name: 'Balo Thể Thao ANTA Sport Pack',
      price: 799000,
      originalPrice: 999000,
      discount: 20,
      image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'accessories',
      badge: 'HOT SALE'
    },
    {
      id: 11,
      name: 'Giày Lifestyle ANTA Street Style',
      price: 1699000,
      originalPrice: 1999000,
      discount: 15,
      image: 'https://images.pexels.com/photos/1599012/pexels-photo-1599012.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'shoes',
      badge: 'FLASH SALE'
    },
    {
      id: 12,
      name: 'Giày Bóng Rổ ANTA Performance',
      price: 2399000,
      originalPrice: 2799000,
      discount: 14,
      image: 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'shoes',
      badge: 'BEST DEAL'
    }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? saleProducts
    : saleProducts.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'discount') return b.discount - a.discount;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const calculateSavings = () => {
    return saleProducts.reduce((total, product) => {
      return total + (product.originalPrice - product.price);
    }, 0);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1
    };

    addToCart(cartItem);

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-icon">✓</div>
      <div class="notification-text">Đã thêm vào giỏ hàng!</div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  };

  const formatNumber = (num) => {
    return String(num).padStart(2, '0');
  };

  return (
    <Layout>
      <div className="mega-sale-page">
        <div className="sale-hero-section">
          <div className="hero-background-decoration">
            <div className="decoration-circle decoration-circle-1"></div>
            <div className="decoration-circle decoration-circle-2"></div>
            <div className="decoration-circle decoration-circle-3"></div>
          </div>
          
          <div className="container">
            <div className="sale-hero-content">
              <div className="hero-badge">SIÊU SALE CUỐI NĂM</div>
              <h1 className="hero-title">MEGA SALE</h1>
              <p className="hero-subtitle">GIẢM GIÁ LÊN ĐẾN 50%</p>
              
              <div className="sale-countdown">
                <div className="countdown-item">
                  <span className="countdown-value">{formatNumber(timeRemaining.days)}</span>
                  <span className="countdown-label">Ngày</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <span className="countdown-value">{formatNumber(timeRemaining.hours)}</span>
                  <span className="countdown-label">Giờ</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <span className="countdown-value">{formatNumber(timeRemaining.minutes)}</span>
                  <span className="countdown-label">Phút</span>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <span className="countdown-value">{formatNumber(timeRemaining.seconds)}</span>
                  <span className="countdown-label">Giây</span>
                </div>
              </div>
              
              <div className="sale-stats">
                <div className="stat-item">
                  <div className="stat-value">{saleProducts.length}+</div>
                  <div className="stat-label">Sản phẩm giảm giá</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">50%</div>
                  <div className="stat-label">Giảm tối đa</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{(calculateSavings() / 1000000).toFixed(1)}M+</div>
                  <div className="stat-label">Tiết kiệm</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sale-products-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Sản Phẩm Giảm Giá</h2>
              <p className="section-subtitle">Nhanh tay chọn ngay sản phẩm ưa thích của bạn</p>
            </div>

            <div className="sale-filters">
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="sort-filter">
                <label htmlFor="sort">Sắp xếp:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="discount">Giảm giá cao nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
              </div>
            </div>

            <div className="sale-products-grid">
              {sortedProducts.map(product => (
                <div
                  key={product.id}
                  className="sale-product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} />
                    <div className={`sale-badge badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`}>
                      {product.badge}
                    </div>
                    <div className="discount-badge">-{product.discount}%</div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-prices">
                      <span className="sale-price">{product.price.toLocaleString()}₫</span>
                      <span className="original-price">{product.originalPrice.toLocaleString()}₫</span>
                    </div>
                    <div className="savings-amount">
                      Tiết kiệm: {(product.originalPrice - product.price).toLocaleString()}₫
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <span className="btn-icon">🛒</span>
                        <span className="btn-text">Thêm giỏ hàng</span>
                      </button>
                      <button
                        className="buy-now-btn"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sale-benefits-section">
          <div className="container">
            <h2 className="section-title">Ưu Đãi Đặc Biệt</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🚚</div>
                <h3>Miễn Phí Vận Chuyển</h3>
                <p>Cho mọi đơn hàng từ 500.000₫</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🎁</div>
                <h3>Quà Tặng Hấp Dẫn</h3>
                <p>Nhận ngay quà tặng khi mua hàng</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💳</div>
                <h3>Thanh Toán Linh Hoạt</h3>
                <p>Nhiều hình thức thanh toán</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🔄</div>
                <h3>Đổi Trả Dễ Dàng</h3>
                <p>Đổi trả trong vòng 30 ngày</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
