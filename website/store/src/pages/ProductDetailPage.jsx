import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components';
import { useCart, useWishlist } from '../contexts';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const product = {
    id: id || 1,
    name: "Giày Chạy Thể Thao Nam PG7 2.0 ANTA",
    price: 1699000,
    originalPrice: 1899000,
    sku: "1125E5546-8",
    brand: "ANTA",
    rating: 4.5,
    reviewCount: 127,
    images: [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: 'Đen', value: 'black', hex: '#000000' },
      { name: 'Trắng', value: 'white', hex: '#FFFFFF' },
      { name: 'Xám', value: 'gray', hex: '#808080' },
      { name: 'Đỏ', value: 'red', hex: '#D70010' }
    ],
    description: `Giày chạy bộ ANTA PG7 2.0 được thiết kế đặc biệt dành cho những vận động viên và người yêu thích chạy bộ. Với công nghệ đế giữa PG7 tiên tiến, đôi giày này mang lại sự thoải mái tối đa, giảm chấn hiệu quả và hỗ trợ tối ưu cho từng bước chạy của bạn.`,
    features: [
      'Công nghệ đế giữa PG7 giúp giảm trọng lượng, giảm chấn và hấp thụ sốc tốt',
      'Bề mặt sử dụng sợi cấu trúc phức hợp rỗng siêu mỏng đặc biệt, nhanh khô và nhẹ',
      'Mũi giày phối da, thiết kế chống va chạm, bảo vệ các đầu ngón chân',
      'Lưỡi gà mềm mại, chất liệu lưới thoáng khí',
      'Gót giày thiết kế miếng TPU bọc gót, ổn định bàn chân khi tiếp đất',
      'Đế ngoài cao su chống mài mòn với cấu trúc Grip Pro tăng độ bám'
    ],
    specifications: {
      'Mã sản phẩm': '1125E5546-8',
      'Giới tính': 'Nam',
      'Chất liệu Upper': 'Vải Mesh + Synthetic',
      'Công nghệ đế giữa': 'PG7 Midsole Technology',
      'Chất liệu đế ngoài': 'Cao su chống mài mòn',
      'Trọng lượng': 'Khoảng 280g (Size 42)',
      'Xuất xứ': 'Trung Quốc',
      'Bảo hành': '6 tháng lỗi nhà sản xuất'
    },
    inStock: true
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Giày Chạy Thể Thao Nữ ANTA Speed",
      price: 1599000,
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 3,
      name: "Giày Thể Thao Nam ANTA Lifestyle",
      price: 1899000,
      image: "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 4,
      name: "Giày Bóng Rổ ANTA Basketball Elite",
      price: 2199000,
      image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 5,
      name: "Giày Chạy ANTA Ultra Light",
      price: 1799000,
      image: "https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích thước');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });

    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích thước');
      return;
    }

    handleAddToCart();
    navigate('/cart');
  };

  const handleToggleWishlist = async () => {
    try {
      const productIdNum = parseInt(id);
      if (isInWishlist(productIdNum)) {
        await removeFromWishlist(productIdNum);
        alert('Đã xóa khỏi danh sách yêu thích');
      } else {
        await addToWishlist(productIdNum);
        alert('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    }
  };

  const discount = calculateDiscount();
  const inWishlist = isInWishlist(parseInt(id));

  return (
    <Layout>
      <div className="pdp-page">
        <div className="pdp-breadcrumbs">
          <div className="container">
            <button className="breadcrumb-link" onClick={() => navigate('/home')}>Trang chủ</button>
            <span className="breadcrumb-separator">/</span>
            <button className="breadcrumb-link" onClick={() => navigate('/products')}>Sản phẩm</button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-active">{product.name}</span>
          </div>
        </div>

        <div className="pdp-main">
          <div className="container">
            <div className="pdp-layout">
              <div className="pdp-gallery">
                <div 
                  className="gallery-main"
                  ref={imageRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img 
                    src={product.images[selectedImage]} 
                    alt={product.name}
                    style={isZoomed ? {
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      cursor: 'zoom-in'
                    } : {}}
                  />
                  {discount > 0 && (
                    <div className="discount-badge">-{discount}%</div>
                  )}
                </div>
                <div className="gallery-thumbs">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumb-item ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pdp-details">
                <div className="product-header">
                  <span className="brand-label">{product.brand}</span>
                  <span className="sku-label">SKU: {product.sku}</span>
                </div>

                <h1 className="product-title">{product.name}</h1>

                <div className="product-rating">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= Math.floor(product.rating) ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">({product.reviewCount} đánh giá)</span>
                </div>

                <div className="price-section">
                  <div className="price-main">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                        <span className="discount-label">-{discount}%</span>
                      </>
                    )}
                  </div>
                  <div className="stock-status">
                    {product.inStock ? (
                      <span className="in-stock">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Còn hàng
                      </span>
                    ) : (
                      <span className="out-of-stock">Hết hàng</span>
                    )}
                  </div>
                </div>

                <div className="product-description">
                  <p>{product.description}</p>
                </div>

                <div className="product-options">
                  <div className="option-group">
                    <label className="option-label">
                      Màu sắc: 
                      <span className="selected-value">
                        {product.colors.find(c => c.value === selectedColor)?.name}
                      </span>
                    </label>
                    <div className="color-options">
                      {product.colors.map((color) => (
                        <button
                          key={color.value}
                          className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setSelectedColor(color.value)}
                          title={color.name}
                          aria-label={color.name}
                        >
                          {selectedColor === color.value && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke={color.value === 'white' ? '#000' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <label className="option-label">
                      Kích thước: 
                      {selectedSize && <span className="selected-value">EU {selectedSize}</span>}
                    </label>
                    <div className="size-options">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <label className="option-label">Số lượng:</label>
                    <div className="quantity-selector">
                      <button
                        className="qty-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="qty-input"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <button
                        className="qty-btn"
                        onClick={() => setQuantity(quantity + 1)}
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn-buy-now" onClick={handleBuyNow}>
                    MUA NGAY
                  </button>
                  <button className="btn-add-cart" onClick={handleAddToCart}>
                    THÊM VÀO GIỎ
                  </button>
                  <button
                    className={`btn-wishlist ${inWishlist ? 'active' : ''}`}
                    onClick={handleToggleWishlist}
                    aria-label={inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                <div className="benefits-list">
                  <div className="benefit">
                    <div className="benefit-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                    </div>
                    <div className="benefit-content">
                      <strong>Miễn phí vận chuyển</strong>
                      <span>Đơn hàng từ 999.000₫</span>
                    </div>
                  </div>
                  <div className="benefit">
                    <div className="benefit-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      </svg>
                    </div>
                    <div className="benefit-content">
                      <strong>Đổi trả trong 30 ngày</strong>
                      <span>Miễn phí đổi size</span>
                    </div>
                  </div>
                  <div className="benefit">
                    <div className="benefit-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div className="benefit-content">
                      <strong>Chính hãng 100%</strong>
                      <span>Cam kết hàng chính hãng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pdp-tabs">
          <div className="container">
            <div className="tabs-nav">
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Mô tả sản phẩm
              </button>
              <button
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Thông số kỹ thuật
              </button>
              <button
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá ({product.reviewCount})
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === 'description' && (
                <div className="tab-panel">
                  <h3 className="panel-heading">Giới thiệu sản phẩm</h3>
                  <p className="panel-text">{product.description}</p>
                  <h4 className="panel-subheading">Đặc điểm nổi bật</h4>
                  <ul className="features-list">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="tab-panel">
                  <h3 className="panel-heading">Thông số kỹ thuật</h3>
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-label">{key}</td>
                          <td className="spec-value">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-panel">
                  <h3 className="panel-heading">Đánh giá từ khách hàng</h3>
                  <div className="reviews-summary">
                    <div className="summary-score">
                      <span className="score-number">{product.rating}</span>
                      <div className="score-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${star <= Math.floor(product.rating) ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="score-count">{product.reviewCount} đánh giá</span>
                    </div>
                  </div>
                  <div className="reviews-list">
                    <div className="review-item">
                      <div className="review-header">
                        <strong className="reviewer-name">Nguyễn Văn A</strong>
                        <div className="review-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="star filled">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="review-text">Giày rất đẹp và chất lượng. Đi rất êm chân, phù hợp cho chạy bộ hàng ngày.</p>
                      <span className="review-time">2 ngày trước</span>
                    </div>
                    <div className="review-item">
                      <div className="review-header">
                        <strong className="reviewer-name">Trần Thị B</strong>
                        <div className="review-stars">
                          {[1, 2, 3, 4].map((star) => (
                            <span key={star} className="star filled">★</span>
                          ))}
                          <span className="star">★</span>
                        </div>
                      </div>
                      <p className="review-text">Sản phẩm tốt, giao hàng nhanh. Tuy nhiên size hơi bé so với mô tả.</p>
                      <span className="review-time">1 tuần trước</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pdp-related">
          <div className="container">
            <h2 className="section-title">Sản phẩm liên quan</h2>
            <div className="related-grid">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  className="related-card"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="related-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="related-info">
                    <h3 className="related-name">{item.name}</h3>
                    <div className="related-price">
                      <span>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}