import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts';
import './ProductSections.css';

const ProductSections = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('shoes');
  const [activeGender, setActiveGender] = useState('nam');
  const [activeSportswear, setActiveSportswear] = useState('ao-nam');
  const [favorites, setFavorites] = useState(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mock data for products
  const shoesData = {
    nam: [
      {
        id: 1,
        name: "Giày Chạy Thể Thao Nam Basic Running ANTA 912585571-2",
        price: 1259100,
        originalPrice: 1399000,
        discount: 10,
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400",
        isOnline: false
      },
      {
        id: 2,
        name: "Giày Chạy Thể Thao Nam Performance ANTA 912585572-3",
        price: 1599000,
        originalPrice: 1999000,
        discount: 20,
        image: "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=400",
        isOnline: true
      },
      {
        id: 3,
        name: "Giày Chạy Thể Thao Nam Speed ANTA 912585573-4",
        price: 1899000,
        originalPrice: 2199000,
        discount: 14,
        image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400",
        isOnline: true
      },
      {
        id: 4,
        name: "Giày Chạy Thể Thao Nam Endurance ANTA 912585574-5",
        price: 2199000,
        originalPrice: 2499000,
        discount: 12,
        image: "https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=400",
        isOnline: false
      }
    ],
    nu: [
      {
        id: 5,
        name: "Giày Chạy Thể Thao Nữ Basic Running ANTA 912585575-6",
        price: 1159100,
        originalPrice: 1299000,
        discount: 11,
        image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400",
        isOnline: false
      },
      {
        id: 6,
        name: "Giày Chạy Thể Thao Nữ Performance ANTA 912585576-7",
        price: 1499000,
        originalPrice: 1799000,
        discount: 17,
        image: "https://images.pexels.com/photos/1456705/pexels-photo-1456705.jpeg?auto=compress&cs=tinysrgb&w=400",
        isOnline: true
      },
      {
        id: 7,
        name: "Giày Chạy Thể Thao Nữ Speed ANTA 912585577-8",
        price: 1799000,
        originalPrice: 2099000,
        discount: 14,
        image: "https://images.pexels.com/photos/2300334/pexels-photo-2300334.jpeg?auto=compress&cs=tinysrgb&w=400",
        isOnline: true
      },
      {
        id: 8,
        name: "Giày Chạy Thể Thao Nữ Endurance ANTA 912585578-9",
        price: 2099000,
        originalPrice: 2399000,
        discount: 13,
        image: "https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg?auto=compress&cs=tinysrgb&w=400",
        isOnline: false
      }
    ]
  };

  const sportswearData = {
    'ao-nam': [
      {
        id: 9,
        name: "Áo Phông Thể Thao Nam Running Anta",
        price: 599000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/1232594/pexels-photo-1232594.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5112-1"
      },
      {
        id: 10,
        name: "Áo Phông Thể Thao Nam Performance Anta",
        price: 499000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/8844893/pexels-photo-8844893.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5113-2"
      },
      {
        id: 11,
        name: "Áo Polo Thể Thao Nam Premium Anta",
        price: 1359200,
        originalPrice: 1699000,
        discount: 20,
        image: "https://images.pexels.com/photos/2112648/pexels-photo-2112648.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5114-3"
      },
      {
        id: 12,
        name: "Áo Khoác Thể Thao Nam Next Generation",
        price: 1979100,
        originalPrice: 2199000,
        discount: 10,
        image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5115-4"
      }
    ],
    'ao-nu': [
      {
        id: 15,
        name: "Áo Phông Thể Thao Nữ Running Anta",
        price: 549000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5118-1"
      },
      {
        id: 16,
        name: "Áo Thể Thao Nữ Performance Anta",
        price: 479000,
        originalPrice: 599000,
        discount: 20,
        image: "https://images.pexels.com/photos/4498221/pexels-photo-4498221.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5119-2"
      },
      {
        id: 17,
        name: "Áo Tank Top Thể Thao Nữ Premium Anta",
        price: 399000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5120-3"
      },
      {
        id: 18,
        name: "Áo Khoác Thể Thao Nữ Active Anta",
        price: 1799000,
        originalPrice: 1999000,
        discount: 10,
        image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5121-4"
      }
    ],
    'quan-nam': [
      {
        id: 19,
        name: "Quần Short Thể Thao Nam Anta",
        price: 799000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5116-5"
      },
      {
        id: 20,
        name: "Quần Dài Thể Thao Nam Anta",
        price: 999000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5117-6"
      },
      {
        id: 21,
        name: "Quần Jogger Thể Thao Nam Premium Anta",
        price: 1199000,
        originalPrice: 1499000,
        discount: 20,
        image: "https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5122-7"
      },
      {
        id: 22,
        name: "Quần Training Thể Thao Nam Anta",
        price: 899000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5123-8"
      }
    ],
    'quan-nu': [
      {
        id: 23,
        name: "Quần Short Thể Thao Nữ Anta",
        price: 699000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/4498370/pexels-photo-4498370.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5124-9"
      },
      {
        id: 24,
        name: "Quần Dài Thể Thao Nữ Anta",
        price: 899000,
        originalPrice: 1099000,
        discount: 18,
        image: "https://images.pexels.com/photos/4498221/pexels-photo-4498221.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5125-10"
      },
      {
        id: 25,
        name: "Quần Legging Thể Thao Nữ Premium Anta",
        price: 799000,
        originalPrice: null,
        discount: 0,
        image: "https://images.pexels.com/photos/3775155/pexels-photo-3775155.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5126-11"
      },
      {
        id: 26,
        name: "Quần Jogger Thể Thao Nữ Anta",
        price: 1099000,
        originalPrice: 1299000,
        discount: 15,
        image: "https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=400",
        model: "1525C5127-12"
      }
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const handleSportswearTabChange = (category) => {
    if (category === activeSportswear) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSportswear(category);
      setIsTransitioning(false);
    }, 150);
  };

  const toggleFavorite = (e, productId) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
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

    // Show confirmation
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--color-success);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 300ms ease-out;
    `;
    notification.textContent = '✓ Đã thêm vào giỏ hàng!';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderProductCard = (product) => (
    <div
      key={product.id}
      className="product-card"
      onClick={() => handleProductClick(product.id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-actions">
          <button
            className={`action-button heart-button ${favorites.has(product.id) ? 'active' : ''}`}
            onClick={(e) => toggleFavorite(e, product.id)}
            title={favorites.has(product.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            <span>{favorites.has(product.id) ? '❤' : '♡'}</span>
          </button>
          <button
            className="action-button cart-button"
            onClick={(e) => handleAddToCart(e, product)}
            title="Thêm vào giỏ hàng"
          >
            <span>🛒</span>
          </button>
        </div>
        {product.isOnline && (
          <div className="online-badge">ONLINE</div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-brand">ANTA</div>
        <h3 className="product-name">{product.name}</h3>
        {product.model && (
          <div className="product-model">{product.model}</div>
        )}
        
        <div className="product-pricing">
          <div className="current-price">{formatPrice(product.price)}</div>
          {product.originalPrice && (
            <>
              <div className="original-price">{formatPrice(product.originalPrice)}</div>
              <div className="discount-badge">-{product.discount}%</div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="product-sections">
      {/* Sports Shoes Section */}
      <section className="product-section">
        <div className="section-header">
          <button className="section-title-button">
            GIÀY THỂ THAO
          </button>
        </div>
        
        <div className="category-tabs">
          <button 
            className={`tab-button ${activeGender === 'nam' ? 'active' : ''}`}
            onClick={() => setActiveGender('nam')}
          >
            Giày nam
          </button>
          <button 
            className={`tab-button ${activeGender === 'nu' ? 'active' : ''}`}
            onClick={() => setActiveGender('nu')}
          >
            Giày nữ
          </button>
        </div>
        
        <div className="products-grid">
          {shoesData[activeGender].map(renderProductCard)}
        </div>
        
        <div className="view-all-section">
          <button className="view-all-button">
            Xem tất cả &gt;
          </button>
        </div>
      </section>

      {/* Sportswear Section */}
      <section className="product-section">
        <div className="section-header">
          <button className="section-title-button">
            QUẦN ÁO THỂ THAO
          </button>
        </div>
        
        <div className="category-tabs">
          <button
            className={`tab-button ${activeSportswear === 'ao-nam' ? 'active' : ''}`}
            onClick={() => handleSportswearTabChange('ao-nam')}
          >
            Áo nam
          </button>
          <button
            className={`tab-button ${activeSportswear === 'ao-nu' ? 'active' : ''}`}
            onClick={() => handleSportswearTabChange('ao-nu')}
          >
            Áo nữ
          </button>
          <button
            className={`tab-button ${activeSportswear === 'quan-nam' ? 'active' : ''}`}
            onClick={() => handleSportswearTabChange('quan-nam')}
          >
            Quần nam
          </button>
          <button
            className={`tab-button ${activeSportswear === 'quan-nu' ? 'active' : ''}`}
            onClick={() => handleSportswearTabChange('quan-nu')}
          >
            Quần nữ
          </button>
        </div>

        <div className={`products-grid ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          {sportswearData[activeSportswear].map(renderProductCard)}
        </div>
        
        <div className="view-all-section">
          <button className="view-all-button">
            Xem tất cả &gt;
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductSections;
