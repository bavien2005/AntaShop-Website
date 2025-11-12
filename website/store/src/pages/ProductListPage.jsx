import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components';
import './ProductListPage.css';

export default function ProductListPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');

  const products = [
    {
      id: 1,
      name: "Giày Chạy Thể Thao Nam ANTA Running Pro",
      price: "1.259.100₫",
      originalPrice: "1.399.000₫",
      discount: "10%",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: "HOT",
      category: "running",
      sizes: [39, 40, 41, 42, 43]
    },
    {
      id: 2,
      name: "Giày Chạy Thể Thao Nữ ANTA Speed",
      price: "1.599.000₫",
      originalPrice: "1.999.000₫",
      discount: "20%",
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: "SALE",
      category: "running",
      sizes: [36, 37, 38, 39, 40]
    },
    {
      id: 3,
      name: "Giày Thể Thao Nam ANTA Lifestyle",
      price: "1.899.000₫",
      originalPrice: "2.199.000₫",
      discount: "14%",
      image: "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: "NEW",
      category: "lifestyle",
      sizes: [39, 40, 41, 42, 43, 44]
    },
    {
      id: 4,
      name: "Giày Bóng Rổ ANTA Basketball Elite",
      price: "2.199.000₫",
      originalPrice: "2.499.000₫",
      discount: "12%",
      image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: "HOT",
      category: "basketball",
      sizes: [40, 41, 42, 43, 44, 45]
    },
    {
      id: 5,
      name: "Giày Chạy ANTA Ultra Light",
      price: "1.799.000₫",
      originalPrice: "2.099.000₫",
      discount: "14%",
      image: "https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: "NEW",
      category: "running",
      sizes: [38, 39, 40, 41, 42]
    },
    {
      id: 6,
      name: "Giày Training ANTA Workout",
      price: "1.499.000₫",
      originalPrice: "1.799.000₫",
      discount: "17%",
      image: "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: "SALE",
      category: "training",
      sizes: [39, 40, 41, 42, 43]
    },
    {
      id: 7,
      name: "Giày Lifestyle ANTA Street Style",
      price: "1.699.000₫",
      originalPrice: "1.999.000₫",
      discount: "15%",
      image: "https://images.pexels.com/photos/1599012/pexels-photo-1599012.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: "HOT",
      category: "lifestyle",
      sizes: [38, 39, 40, 41, 42, 43]
    },
    {
      id: 8,
      name: "Giày Bóng Rổ ANTA Performance",
      price: "2.399.000₫",
      originalPrice: "2.799.000₫",
      discount: "14%",
      image: "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: "NEW",
      category: "basketball",
      sizes: [40, 41, 42, 43, 44]
    }
  ];

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Layout>
      <div className="product-list-page">
        <div className="breadcrumbs">
          <div className="container">
            <span className="breadcrumb-link" onClick={() => navigate('/home')}>Trang chủ</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Sản phẩm</span>
          </div>
        </div>

        <div className="page-header">
          <div className="container">
            <h1 className="page-title">Tất Cả Sản Phẩm</h1>
            <p className="page-subtitle">Khám phá bộ sưu tập giày thể thao ANTA chính hãng</p>
          </div>
        </div>

        <div className="products-section">
          <div className="container">
            <div className="products-layout">
              <aside className="filters-sidebar">
                <h2 className="sidebar-main-title">Bộ lọc</h2>
                <div className="filter-section">
                  <h3 className="filter-title">Danh Mục</h3>
                  <div className="filter-options">
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === 'all'}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <span>Tất cả</span>
                    </label>
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value="running"
                        checked={selectedCategory === 'running'}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <span>Giày Chạy</span>
                    </label>
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value="basketball"
                        checked={selectedCategory === 'basketball'}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <span>Giày Bóng Rổ</span>
                    </label>
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value="lifestyle"
                        checked={selectedCategory === 'lifestyle'}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <span>Lifestyle</span>
                    </label>
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value="training"
                        checked={selectedCategory === 'training'}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <span>Training</span>
                    </label>
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">Kích Thước</h3>
                  <div className="filter-options">
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="size"
                        value="all"
                        checked={selectedSize === 'all'}
                        onChange={(e) => setSelectedSize(e.target.value)}
                      />
                      <span>Tất cả</span>
                    </label>
                    {[38, 39, 40, 41, 42, 43, 44, 45].map(size => (
                      <label key={size} className="filter-option">
                        <input
                          type="radio"
                          name="size"
                          value={size}
                          checked={selectedSize === size.toString()}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        />
                        <span>Size {size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">Giá</h3>
                  <div className="filter-options">
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={priceRange === 'all'}
                        onChange={(e) => setPriceRange(e.target.value)}
                      />
                      <span>Tất cả</span>
                    </label>
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="price"
                        value="under1m"
                        checked={priceRange === 'under1m'}
                        onChange={(e) => setPriceRange(e.target.value)}
                      />
                      <span>Dưới 1.000.000₫</span>
                    </label>
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="price"
                        value="1m-2m"
                        checked={priceRange === '1m-2m'}
                        onChange={(e) => setPriceRange(e.target.value)}
                      />
                      <span>1.000.000₫ - 2.000.000₫</span>
                    </label>
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="price"
                        value="over2m"
                        checked={priceRange === 'over2m'}
                        onChange={(e) => setPriceRange(e.target.value)}
                      />
                      <span>Trên 2.000.000₫</span>
                    </label>
                  </div>
                </div>
              </aside>

              <div className="products-main">
                <div className="products-toolbar">
                  <div className="toolbar-left">
                    <span className="products-count">{products.length} sản phẩm</span>
                  </div>
                  
                  <div className="toolbar-right">
                    <div className="view-mode-toggle">
                      <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                      >
                        ⊞
                      </button>
                      <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                      >
                        ☰
                      </button>
                    </div>
                    
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Mặc định</option>
                      <option value="price-asc">Giá: Thấp đến cao</option>
                      <option value="price-desc">Giá: Cao đến thấp</option>
                      <option value="name-asc">Tên: A-Z</option>
                      <option value="name-desc">Tên: Z-A</option>
                      <option value="newest">Mới nhất</option>
                    </select>
                  </div>
                </div>

                <div className={`products-grid ${viewMode}`}>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                        {product.badge && (
                          <span className={`product-badge ${product.badge.toLowerCase()}`}>
                            {product.badge}
                          </span>
                        )}
                        <div className="product-overlay">
                          <button className="quick-view">XEM NHANH</button>
                          <button className="add-to-cart">THÊM VÀO GIỎ</button>
                        </div>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-price">
                          <span className="current-price">{product.price}</span>
                          {product.originalPrice && (
                            <span className="original-price">{product.originalPrice}</span>
                          )}
                          {product.discount && (
                            <span className="discount">-{product.discount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pagination">
                  <button className="pagination-btn" disabled>‹</button>
                  <button className="pagination-btn active">1</button>
                  <button className="pagination-btn">2</button>
                  <button className="pagination-btn">3</button>
                  <button className="pagination-btn">›</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
