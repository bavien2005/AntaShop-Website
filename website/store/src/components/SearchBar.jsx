import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Search products function with mock data fallback
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await productService.searchProducts(query);
      setSearchResults(results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data
      const mockProducts = [
        {
          id: 1,
          name: 'Giày Chạy Thể Thao Nam ANTA Running Pro',
          price: 1259100,
          image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 2,
          name: 'Giày Chạy Thể Thao Nữ ANTA Speed',
          price: 1599000,
          image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          id: 3,
          name: 'Giày Thể Thao Nam ANTA Lifestyle',
          price: 1899000,
          image: 'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ];
      const filtered = mockProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
      setSearchTerm('');
    }
  };

  // Handle product click
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
    setShowResults(false);
    setSearchTerm('');
  };

  // Handle input focus
  const handleFocus = () => {
    if (searchTerm.trim() && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-bar-inline" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form-inline">
        <div className="search-input-wrapper-inline">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M19 19L13.8 13.8M16 8.5C16 12.6421 12.6421 16 8.5 16C4.35786 16 1 12.6421 1 8.5C1 4.35786 4.35786 1 8.5 1C12.6421 1 16 4.35786 16 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            className="search-input-inline"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
                setShowResults(false);
              }}
            >
              ×
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="search-dropdown-results">
          {isLoading ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <span>Đang tìm kiếm...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="results-list-inline">
              {searchResults.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="result-item-inline"
                  onClick={() => handleProductClick(product)}
                >
                  <img src={product.image || '/placeholder.jpg'} alt={product.name} />
                  <div className="result-info-inline">
                    <h4>{product.name}</h4>
                    <p className="result-price-inline">{product.price.toLocaleString()}₫</p>
                  </div>
                </div>
              ))}
              {searchResults.length > 5 && (
                <div className="view-all-results-inline">
                  <button onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                    setShowResults(false);
                    setSearchTerm('');
                  }}>
                    Xem tất cả {searchResults.length} sản phẩm
                  </button>
                </div>
              )}
            </div>
          ) : searchTerm && (
            <div className="no-results-inline">
              <p>Không tìm thấy sản phẩm</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
