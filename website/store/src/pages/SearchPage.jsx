import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components';
import './SearchPage.css';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [filters, setFilters] = useState({
    category: [],
    price: '',
    size: [],
    color: [],
    brand: []
  });
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  const mockProducts = [
    {
      id: 1,
      name: 'Giày Chạy Thể Thao Nam ANTA Running Pro',
      price: 1259100,
      originalPrice: 1399000,
      discount: '10%',
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Giày',
      brand: 'ANTA',
      sizes: [39, 40, 41, 42, 43],
      colors: ['Đen', 'Trắng'],
      badge: 'HOT'
    },
    {
      id: 2,
      name: 'Giày Chạy Thể Thao Nữ ANTA Speed',
      price: 1599000,
      originalPrice: 1999000,
      discount: '20%',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Giày',
      brand: 'ANTA',
      sizes: [36, 37, 38, 39],
      colors: ['Hồng', 'Xám'],
      badge: 'SALE'
    },
    {
      id: 3,
      name: 'Giày Thể Thao Nam ANTA Lifestyle',
      price: 1899000,
      originalPrice: 2199000,
      discount: '14%',
      image: 'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Giày',
      brand: 'ANTA',
      sizes: [40, 41, 42, 43, 44],
      colors: ['Đen', 'Xanh'],
      badge: 'NEW'
    },
    {
      id: 4,
      name: 'Giày Bóng Rổ ANTA Basketball Elite',
      price: 2199000,
      originalPrice: 2499000,
      discount: '12%',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Giày',
      brand: 'ANTA',
      sizes: [41, 42, 43, 44],
      colors: ['Đỏ', 'Đen'],
      badge: 'HOT'
    },
    {
      id: 5,
      name: '��o Thể Thao Nam ANTA Performance',
      price: 599000,
      originalPrice: null,
      discount: null,
      image: 'https://images.pexels.com/photos/1232594/pexels-photo-1232594.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Áo',
      brand: 'ANTA',
      sizes: ['M', 'L', 'XL'],
      colors: ['Tr���ng', 'Đen'],
      badge: 'NEW'
    },
    {
      id: 6,
      name: 'Quần Short Thể Thao ANTA Training',
      price: 499000,
      originalPrice: null,
      discount: null,
      image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Quần',
      brand: 'ANTA',
      sizes: ['M', 'L', 'XL'],
      colors: ['Xám', 'Đen'],
      badge: 'NEW'
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const currentValues = prev[filterType];
        if (currentValues.includes(value)) {
          return { ...prev, [filterType]: currentValues.filter(v => v !== value) };
        } else {
          return { ...prev, [filterType]: [...currentValues, value] };
        }
      } else {
        return { ...prev, [filterType]: value };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      price: '',
      size: [],
      color: [],
      brand: []
    });
  };

  const filteredProducts = mockProducts.filter(product => {
    if (query && !product.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }

    if (filters.category.length > 0 && !filters.category.includes(product.category)) {
      return false;
    }

    if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
      return false;
    }

    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number);
      if (product.price < min || (max && product.price > max)) {
        return false;
      }
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="search-page">
        <div className="breadcrumbs">
          <div className="container">
            <Link to="/home" className="breadcrumb-link">Trang chủ</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Tìm kiếm</span>
          </div>
        </div>

        <div className="search-container">
          <div className="search-header">
            <h1>Kết quả tìm kiếm {query && `cho "${query}"`}</h1>
            <p className="result-count">{sortedProducts.length} sản phẩm</p>
          </div>

          <div className="search-layout">
              <aside className="filters-sidebar">
                <div className="filters-header">
                  <h3>Bộ lọc</h3>
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Xóa tất cả
                  </button>
                </div>

                <div className="filter-section">
                  <h4 className="filter-title">Danh mục</h4>
                  <div className="filter-options">
                    {['Giày', 'Áo', 'Quần', 'Phụ kiện'].map(category => (
                      <label key={category} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(category)}
                          onChange={() => handleFilterChange('category', category)}
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h4 className="filter-title">Khoảng giá</h4>
                  <div className="filter-options">
                    {[
                      { label: 'Dưới 500.000₫', value: '0-500000' },
                      { label: '500.000₫ - 1.000.000₫', value: '500000-1000000' },
                      { label: '1.000.000₫ - 2.000.000₫', value: '1000000-2000000' },
                      { label: 'Trên 2.000.000₫', value: '2000000-999999999' }
                    ].map(range => (
                      <label key={range.value} className="filter-radio">
                        <input
                          type="radio"
                          name="price"
                          checked={filters.price === range.value}
                          onChange={() => handleFilterChange('price', range.value)}
                        />
                        <span>{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h4 className="filter-title">Kích thước</h4>
                  <div className="filter-options size-grid">
                    {[39, 40, 41, 42, 43, 44, 'M', 'L', 'XL'].map(size => (
                      <button
                        key={size}
                        className={`size-btn ${filters.size.includes(size) ? 'active' : ''}`}
                        onClick={() => handleFilterChange('size', size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h4 className="filter-title">Màu sắc</h4>
                  <div className="filter-options color-grid">
                    {[
                      { name: 'Đen', color: '#000' },
                      { name: 'Trắng', color: '#fff' },
                      { name: 'Xám', color: '#808080' },
                      { name: 'Đỏ', color: '#ff0000' },
                      { name: 'Xanh', color: '#0000ff' },
                      { name: 'Hồng', color: '#ffc0cb' }
                    ].map(({ name, color }) => (
                      <button
                        key={name}
                        className={`color-btn ${filters.color.includes(name) ? 'active' : ''}`}
                        onClick={() => handleFilterChange('color', name)}
                        title={name}
                      >
                        <span className="color-swatch" style={{ backgroundColor: color }}></span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h4 className="filter-title">Thương hiệu</h4>
                  <div className="filter-options">
                    {['ANTA'].map(brand => (
                      <label key={brand} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.brand.includes(brand)}
                          onChange={() => handleFilterChange('brand', brand)}
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              <main className="results-main">
                <div className="results-toolbar">
                  <div className="sort-section">
                    <label htmlFor="sort">Sắp xếp:</label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="popular">Phổ biến</option>
                      <option value="newest">Mới nhất</option>
                      <option value="price-asc">Giá: Thấp đến cao</option>
                      <option value="price-desc">Giá: Cao đến thấp</option>
                    </select>
                  </div>

                  <div className="view-toggle">
                    <button
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      title="Xem dạng lưới"
                    >
                      ⊞
                    </button>
                    <button
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                      title="Xem dạng danh sách"
                    >
                      ☰
                    </button>
                  </div>
                </div>

                {sortedProducts.length === 0 ? (
                  <div className="no-results">
                    <p>Không tìm thấy sản phẩm</p>
                  </div>
                ) : (
                  <div className={`products-${viewMode}`}>
                    {sortedProducts.map(product => (
                      <div
                        key={product.id}
                        className="product-card"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <div className="product-image-wrapper">
                          {product.badge && (
                            <span className={`product-badge ${product.badge.toLowerCase()}`}>
                              {product.badge}
                            </span>
                          )}
                          <img src={product.image} alt={product.name} />
                          <button className="wishlist-btn">♡</button>
                        </div>
                        <div className="product-details">
                          <h3 className="product-name">{product.name}</h3>
                          <div className="product-price">
                            <span className="current-price">
                              {product.price.toLocaleString()}₫
                            </span>
                            {product.originalPrice && (
                              <>
                                <span className="original-price">
                                  {product.originalPrice.toLocaleString()}₫
                                </span>
                                <span className="discount-badge">-{product.discount}</span>
                              </>
                            )}
                          </div>
                          {viewMode === 'list' && (
                            <div className="product-meta">
                              <p className="product-colors">
                                Màu: {product.colors.join(', ')}
                              </p>
                              <p className="product-sizes">
                                Size: {product.sizes.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sortedProducts.length > 0 && (
                  <div className="pagination">
                    <button className="page-btn" disabled>Trước</button>
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn">Sau</button>
                  </div>
                )}
              </main>
            </div>
        </div>
      </div>
    </Layout>
  );
}
