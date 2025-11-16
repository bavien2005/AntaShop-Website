// src/components/AddProduct.jsx
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
    images: [],
    thumbnail: ''
  });
  const [variants, setVariants] = useState([]);
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
        images: editingProduct.images || (editingProduct.image ? [editingProduct.image] : []),
        thumbnail: editingProduct.thumbnail || ''
      });
      setImagePreview(editingProduct.thumbnail || '');
      setVariants(editingProduct.variants ? editingProduct.variants.map(v => ({ ...v })) : []);
      const cat = categories.find(c => c.name === editingProduct.category);
      if (cat) setSelectedCategory(cat.id);
    }
  }, [editingProduct]);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('Kích thước ảnh không được vượt quá 5MB');
    if (!file.type.startsWith('image/')) return alert('Vui lòng chọn file ảnh');

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      setFormData(prev => ({ ...prev, images: [base64], thumbnail: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => { setImagePreview(''); setFormData(prev => ({ ...prev, images: [], thumbnail: '' })); }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);
    setFormData(prev => ({ ...prev, category: category?.name || '' }));
  };

  // VARIANTS handlers
  const addVariant = () => {
    setVariants(prev => ([...prev, { id: `v-${Date.now()}`, sku: '', size: '', color: '', price: '', quantity: '', image: '' }]));
  };
  const updateVariant = (idx, field, value) => {
    setVariants(prev => prev.map((v,i) => i===idx ? { ...v, [field]: value } : v));
  };
  const removeVariant = (idx) => setVariants(prev => prev.filter((_,i) => i!==idx));

  const validate = () => {
    if (!formData.name) { alert('Vui lòng nhập tên sản phẩm'); return false; }
    if (!formData.category) { alert('Vui lòng chọn danh mục'); return false; }
    if (variants.length === 0 && (!formData.price || !formData.quantity)) { alert('Nếu không dùng variants, điền giá và số lượng'); return false; }
    return true;
  }

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      images: formData.images,
      thumbnail: formData.thumbnail,
      // if variants exist, send them; otherwise send top-level price/quantity
      variants: variants.length ? variants.map(v => ({
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: Number(v.price) || 0,
        quantity: Number(v.quantity) || 0,
        image: v.image || ''
      })) : undefined,
      price: variants.length ? undefined : Number(formData.price) || 0,
      quantity: variants.length ? undefined : Number(formData.quantity) || 0
    };

    try {
      let result;
      if (editingProduct) {
        result = await adminService.products.updateProduct(editingProduct.id, payload);
      } else {
        result = await adminService.products.createProduct(payload);
      }

      if (result.success) {
        alert(result.message || 'Lưu thành công');
        if (onProductSaved) onProductSaved();
        setActiveSubTab && setActiveSubTab('my-products');
      } else {
        alert(result.error || 'Lỗi khi lưu sản phẩm');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc muốn hủy? Tất cả thông tin sẽ bị mất.')) {
      setActiveSubTab && setActiveSubTab('my-products');
    }
  };

  return (
    <div className="add-product-component">
      <div className="add-product-content">
        <div className="page-header-section">
          <div className="header-left">
            <h1 className="page-main-title">{editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h1>
            <p className="page-subtitle">{editingProduct ? 'Cập nhật thông tin sản phẩm' : 'Điền thông tin sản phẩm của bạn'}</p>
          </div>
          <button className="cancel-add-btn" onClick={handleCancel}>← Quay lại</button>
        </div>

        <div className="add-product-grid">
          <div className="product-info-section">
            <div className="section-card">
              <h3 className="section-card-title">Thông Tin Cơ Bản</h3>
              <div className="form-fields-group">
                <div className="form-input-group">
                  <label className="input-label required">Tên sản phẩm</label>
                  <input type="text" className="form-text-input" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ví dụ: Giày ANTA KT7 - Đen" />
                </div>

                <div className="form-input-group">
                  <label className="input-label">Mô tả sản phẩm</label>
                  <textarea className="form-textarea-input" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Mô tả chi tiết về sản phẩm..." rows="4" />
                </div>

                {variants.length === 0 && (
                  <div className="form-row-grid">
                    <div className="form-input-group">
                      <label className="input-label required">Giá bán (VNĐ)</label>
                      <input type="number" className="form-text-input" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} placeholder="Ví dụ: 2990000" />
                    </div>

                    <div className="form-input-group">
                      <label className="input-label required">Số lượng</label>
                      <input type="number" className="form-text-input" value={formData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} placeholder="Ví dụ: 100" />
                    </div>
                  </div>
                )}

                <div className="form-input-group">
                  <label className="input-label">Hình ảnh sản phẩm</label>
                  <div className="image-upload-section">
                    <input type="file" id="product-image-upload" className="file-input-hidden" accept="image/*" onChange={handleImageUpload} />
                    <label htmlFor="product-image-upload" className="file-upload-button">
                      <span className="upload-icon">📷</span>
                      <span className="upload-text">Chọn ảnh từ máy</span>
                      <span className="upload-hint">JPG, PNG, GIF (Max 5MB)</span>
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Preview" className="form-image-preview" />
                      <button type="button" className="remove-preview-btn" onClick={handleRemoveImage}>✕ Xóa ảnh</button>
                    </div>
                  )}
                </div>

                {/* VARIANTS */}
                <div className="section-divider" />
                <h4>Variants (Size / Màu / SKU)</h4>
                <p className="muted">Nếu muốn quản lý size/sku riêng, thêm variants ở đây. Nếu không, dùng trường Giá và Số lượng ở trên.</p>

                <div className="variants-list">
                  {variants.map((v, idx) => (
                    <div key={v.id} className="variant-row">
                      <input className="variant-input small" placeholder="SKU" value={v.sku} onChange={(e)=>updateVariant(idx,'sku', e.target.value)} />
                      <input className="variant-input small" placeholder="Size" value={v.size} onChange={(e)=>updateVariant(idx,'size', e.target.value)} />
                      <input className="variant-input small" placeholder="Màu" value={v.color} onChange={(e)=>updateVariant(idx,'color', e.target.value)} />
                      <input className="variant-input small" placeholder="Giá" type="number" value={v.price} onChange={(e)=>updateVariant(idx,'price', e.target.value)} />
                      <input className="variant-input small" placeholder="Số lượng" type="number" value={v.quantity} onChange={(e)=>updateVariant(idx,'quantity', e.target.value)} />
                      <button className="variant-remove-btn" onClick={()=>removeVariant(idx)}>Xóa</button>
                    </div>
                  ))}
                  <div style={{marginTop: 8}}>
                    <button className="add-variant-btn" onClick={addVariant}>+ Thêm variant</button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="category-section-sidebar">
            <div className="section-card">
              <h3 className="section-card-title">Danh Mục</h3>
              <div className="form-input-group">
                <label className="input-label required">Chọn danh mục</label>
                <input type="text" className="form-text-input" value={formData.category} readOnly placeholder="Chọn danh mục bên dưới..." />
              </div>
              <div className="category-selection-list">
                {categories.map((category) => (
                  <button key={category.id} type="button" className={`category-selection-item ${selectedCategory === category.id ? 'selected' : ''}`} onClick={() => handleCategorySelect(category.id)}>
                    <span className="category-item-icon">{selectedCategory === category.id ? '✓' : '○'}</span>
                    <span className="category-item-name">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="submit-actions-card">
              <button className="submit-product-btn" onClick={handleSubmit} disabled={loading}><span className="btn-icon">{loading ? '⏳' : '✓'}</span>{loading ? 'Đang lưu...' : (editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm')}</button>
              <button className="cancel-product-btn" onClick={handleCancel} disabled={loading}><span className="btn-icon">✕</span>Hủy Bỏ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
