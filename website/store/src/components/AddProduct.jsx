import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './AddProduct.css';

export default function AddProduct({ setActiveSubTab, editingProduct, onProductSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const categories = [
    { id: 'giay-bong-ro', name: 'Giày Bóng Rổ' },
    { id: 'giay-chay-bo', name: 'Giày Chạy Bộ' },
    { id: 'giay-lifestyle', name: 'Giày Lifestyle' },
    { id: 'ao-thun', name: 'Áo Thun' },
    { id: 'ao-khoac', name: 'Áo Khoác' },
    { id: 'quan-short', name: 'Quần Short' },
    { id: 'quan-dai', name: 'Quần Dài' },
    { id: 'phu-kien', name: 'Phụ Kiện' }
  ];

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        quantity: editingProduct.quantity || '',
        category: editingProduct.category || '',
        image: editingProduct.image || ''
      });
      setImagePreview(editingProduct.image || '');

      const category = categories.find(cat => cat.name === editingProduct.category);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [editingProduct]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          image: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    setFormData(prev => ({
      ...prev,
      category: category?.name || ''
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.quantity || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    setLoading(true);
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category,
      image: formData.image || 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400'
    };

    try {
      let result;
      if (editingProduct) {
        result = await adminService.products.updateProduct(editingProduct.id, productData);
      } else {
        result = await adminService.products.createProduct(productData);
      }

      if (result.success) {
        alert(result.message);
        if (onProductSaved) {
          onProductSaved();
        }
        setActiveSubTab('my-products');
      } else {
        alert(result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu sản phẩm');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc muốn hủy? Tất cả thông tin sẽ bị mất.')) {
      if (setActiveSubTab) {
        setActiveSubTab('my-products');
      }
    }
  };

  return (
    <div className="add-product-component">
      <div className="add-product-content">
        <div className="page-header-section">
          <div className="header-left">
            <h1 className="page-main-title">
              {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h1>
            <p className="page-subtitle">
              {editingProduct ? 'Cập nhật thông tin sản phẩm' : 'Điền thông tin sản phẩm của bạn'}
            </p>
          </div>
          <button className="cancel-add-btn" onClick={handleCancel}>
            <span className="btn-icon">←</span>
            Quay lại
          </button>
        </div>

        <div className="add-product-grid">
          <div className="product-info-section">
            <div className="section-card">
              <h3 className="section-card-title">Thông Tin Cơ Bản</h3>
              
              <div className="form-fields-group">
                <div className="form-input-group">
                  <label className="input-label required">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-text-input"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ví dụ: Giày ANTA KT7 - Đen"
                  />
                </div>
                
                <div className="form-input-group">
                  <label className="input-label">Mô tả sản phẩm</label>
                  <textarea
                    className="form-textarea-input"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    rows="4"
                  />
                </div>
                
                <div className="form-row-grid">
                  <div className="form-input-group">
                    <label className="input-label required">Giá bán (VNĐ)</label>
                    <input
                      type="number"
                      className="form-text-input"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Ví dụ: 2990000"
                    />
                  </div>
                  
                  <div className="form-input-group">
                    <label className="input-label required">Số lượng</label>
                    <input
                      type="number"
                      className="form-text-input"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      placeholder="Ví dụ: 100"
                    />
                  </div>
                </div>

                <div className="form-input-group">
                  <label className="input-label">Hình ảnh sản phẩm</label>
                  <div className="image-upload-section">
                    <input
                      type="file"
                      id="product-image-upload"
                      className="file-input-hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="product-image-upload" className="file-upload-button">
                      <span className="upload-icon">📷</span>
                      <span className="upload-text">Chọn ảnh từ máy</span>
                      <span className="upload-hint">JPG, PNG, GIF (Max 5MB)</span>
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="form-image-preview"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        className="remove-preview-btn"
                        onClick={handleRemoveImage}
                      >
                        ✕ Xóa ảnh
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="category-section-sidebar">
            <div className="section-card">
              <h3 className="section-card-title">Danh Mục</h3>
              
              <div className="form-input-group">
                <label className="input-label required">Chọn danh mục</label>
                <input
                  type="text"
                  className="form-text-input"
                  value={formData.category}
                  readOnly
                  placeholder="Chọn danh mục bên dưới..."
                />
              </div>
              
              <div className="category-selection-list">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`category-selection-item ${selectedCategory === category.id ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <span className="category-item-icon">
                      {selectedCategory === category.id ? '✓' : '○'}
                    </span>
                    <span className="category-item-name">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="submit-actions-card">
              <button 
                className="submit-product-btn" 
                onClick={handleSubmit}
                disabled={loading}
              >
                <span className="btn-icon">{loading ? '⏳' : '✓'}</span>
                {loading 
                  ? 'Đang lưu...' 
                  : (editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm')
                }
              </button>
              <button className="cancel-product-btn" onClick={handleCancel} disabled={loading}>
                <span className="btn-icon">✕</span>
                Hủy Bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
