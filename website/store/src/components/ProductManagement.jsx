// src/components/ProductManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import AdminAddProduct from './AdminAddProduct';
import { products as adminProductService } from '../services';
import './ProductManagement.css';

export default function ProductManagement({ activeSubTab, setActiveSubTab, onDataChange }) {
  const [filters, setFilters] = useState({ name: '', quantityMin: '', quantityMax: '', category: '', priceMin: '', priceMax: '' });
  const [productsRaw, setProductsRaw] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expanded, setExpanded] = useState({});
  const normalizeFilters = (raw) => {
    const n = (v) => {
      if (v === '' || v === null || v === undefined) return undefined;
      const x = Number(v);
      return Number.isFinite(x) ? x : undefined;
    };

    const trimmed = {
      name: (raw.name || '').trim(),
      category: (raw.category || '').trim(),
      quantityMin: n(raw.quantityMin),
      quantityMax: n(raw.quantityMax),
      priceMin: n(raw.priceMin),
      priceMax: n(raw.priceMax),
    };

    // swap nếu nhập min > max
    if (trimmed.quantityMin !== undefined && trimmed.quantityMax !== undefined && trimmed.quantityMin > trimmed.quantityMax) {
      [trimmed.quantityMin, trimmed.quantityMax] = [trimmed.quantityMax, trimmed.quantityMin];
    }
    if (trimmed.priceMin !== undefined && trimmed.priceMax !== undefined && trimmed.priceMin > trimmed.priceMax) {
      [trimmed.priceMin, trimmed.priceMax] = [trimmed.priceMax, trimmed.priceMin];
    }

    // loại bỏ field rỗng để API dễ xử lý
    const payload = {};
    Object.entries(trimmed).forEach(([k, v]) => {
      if (v !== '' && v !== undefined) payload[k] = v;
    });

    return payload;
  };

  const isFilterEmpty = (f) => {
    return !(
      (f.name || '').trim() ||
      (f.category || '').trim() ||
      String(f.quantityMin || '').trim() ||
      String(f.quantityMax || '').trim() ||
      String(f.priceMin || '').trim() ||
      String(f.priceMax || '').trim()
    );
  };

  useEffect(() => { loadProducts(); /* eslint-disable-next-line */ }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await adminProductService.getProducts();
      let list = [];
      if (Array.isArray(result)) list = result;
      else if (result?.success) list = result.data || [];
      else if (result?.data && Array.isArray(result.data)) list = result.data;
      else list = [];
      setProductsRaw(list);
      setFilteredProducts(list);
    } catch (err) {
      console.error('Load products error', err);
      setProductsRaw([]); setFilteredProducts([]);
      alert('Lỗi khi tải sản phẩm: ' + (err?.message || err));
    } finally { setLoading(false); }
  };

  const handleFilterChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  const handleSearch = async () => {
    setLoading(true);
    try {
      const payload = normalizeFilters(filters);

      // nếu chưa nhập gì -> trả về list gốc
      if (Object.keys(payload).length === 0) {
        setFilteredProducts(productsRaw);
        return;
      }

      const result = await adminProductService.getProducts(payload);
      if (result?.success) setFilteredProducts(result.data || []);
      else if (Array.isArray(result)) setFilteredProducts(result);
      else setFilteredProducts([]);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const LOW_STOCK_THRESHOLD = 5;

  const getStockStatus = (stock) => {
    const n = Number(stock || 0);
    if (n <= 0) return { key: "out", label: "Hết hàng" };
    if (n <= LOW_STOCK_THRESHOLD) return { key: "low-stock", label: "Sắp hết" };
    return { key: "active", label: "Đang bán" };
  };
  const handleReset = async () => {
    setFilters({ name: '', quantityMin: '', quantityMax: '', category: '', priceMin: '', priceMax: '' });
    setFilteredProducts(productsRaw);
  };

  const formatPrice = (price) => { if (price === null || price === undefined || isNaN(price)) return '—'; return new Intl.NumberFormat('vi-VN').format(price); };

  const placeholderImage = 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400';
  const getProductImage = (product) => product?.thumbnail || product?.image || (product?.images && product.images[0]) || placeholderImage;

  const groupedProducts = useMemo(() => {
    const map = new Map();
    filteredProducts.forEach(item => {
      const productId = item.productId ?? item.id ?? item.product_id ?? item.product?.id ?? null;

      if (Array.isArray(item.variants) && (item.name || item.id)) {
        const pid = item.id;
        if (!map.has(pid)) map.set(pid, { product: item, variants: Array.isArray(item.variants) ? item.variants : [] });
        else { const e = map.get(pid); e.product = { ...e.product, ...item }; e.variants = e.variants.concat(item.variants || []); }
        return;
      }

      if (productId !== null && productId !== undefined) {
        const pid = productId;
        if (!map.has(pid)) {
          const productObj = {
            id: pid,
            name: item.name || item.productName || item.product_name || item.title || 'Sản phẩm',
            thumbnail: item.thumbnail || (item.images && item.images[0]) || item.image || null,
            category: item.category ?? item.categoryName ?? item.cat ?? '', price: item.price ?? item.productPrice ?? 0,
            totalStock: item.totalStock ?? item.total_stock ?? item.quantity ?? item.stock ?? 0,
            rating: item.rating ?? 5,
            sales: item.sales ?? 0,
            variants: Array.isArray(item.variants) ? item.variants : []
          };
          map.set(pid, { product: productObj, variants: [] });
        }
        const entry = map.get(pid);

        let v = item.variant ?? null;
        if (!v && (item.variantId || item.variant_id)) {
          v = {
            id: item.variantId ?? item.variant_id,
            sku: item.variantSku ?? item.sku ?? item.SKU,
            price: item.variantPrice ?? item.price ?? null,
            stock: item.variantStock ?? item.stock ?? item.quantity ?? 0,
            size: (item.variant && item.variant.size) || item.size || '',
            color: (item.variant && item.variant.color) || item.color || '',
            attributes: (item.variant && item.variant.attributes) || item.attributes || null,
            thumbnail: item.variantThumbnail || item.thumbnail || null
          };
        } else if (!v && item.sku && (item.stock !== undefined || item.price !== undefined)) {
          v = {
            id: item.id ?? item.sku,
            sku: item.sku,
            price: item.price ?? null,
            stock: item.stock ?? item.quantity ?? 0,
            size: item.size ?? '',
            color: item.color ?? '',
            attributes: item.attributes ?? null,
            thumbnail: item.thumbnail ?? null
          };
        }

        if (v) entry.variants.push(v);
        return;
      }

      const pid = item.id ?? Math.random().toString(36).slice(2, 8);
      if (!map.has(pid)) map.set(pid, { product: item, variants: [] });
      else { const e = map.get(pid); e.product = { ...e.product, ...item }; }
    });

    return Array.from(map.values());
  }, [filteredProducts]);

  const toggleExpand = (productId) => setExpanded(prev => ({ ...prev, [productId]: !prev[productId] }));

  const computePriceRangeText = (product, variants) => {
    if (variants && variants.length) {
      const prices = variants.map(v => Number(v.price || 0)).filter(x => x > 0);
      if (prices.length) {
        const min = Math.min(...prices), max = Math.max(...prices);
        if (min === max) return `${formatPrice(min)} VNĐ`;
        return `${formatPrice(min)} - ${formatPrice(max)} VNĐ`;
      }
    }
    if (product?.price) return `${formatPrice(Number(product.price))} VNĐ`;
    return '—';
  };

  const computeTotalStock = (product, variants) => {
    if (product && (product.totalStock !== undefined && product.totalStock !== null)) return Number(product.totalStock);
    if (Array.isArray(variants) && variants.length) return variants.reduce((s, v) => s + (Number(v.stock ?? v.quantity ?? 0) || 0), 0);
    return 0;
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      const result = await adminProductService.deleteProduct(productId);
      if (result?.success) { alert(result.message || 'Đã xóa'); await loadProducts(); if (onDataChange) onDataChange(); }
      else alert(result.error || 'Không thể xóa sản phẩm');
    } catch (err) { console.error(err); alert('Lỗi khi xóa sản phẩm'); }
  };

  const handleEditProduct = async (productId) => {
    try {
      const result = await adminProductService.getProduct(productId);
      if (result?.success) { setEditingProduct(result.data); setActiveSubTab('add-product'); }
      else alert('Không thể tải thông tin sản phẩm');
    } catch (err) { console.error(err); alert('Lỗi khi tải sản phẩm'); }
  };

  const handleProductSaved = async (savedProduct) => { setEditingProduct(null); setActiveSubTab('my-products'); await loadProducts(); if (onDataChange) onDataChange(); };

  // src/components/ProductManagement.jsx

  if (activeSubTab === 'add-product') {
    return (
      <AdminAddProduct
        editingProduct={editingProduct}
        onSaved={handleProductSaved}
        onCancel={() => {
          setEditingProduct(null);
          setActiveSubTab('my-products');
        }}

        // ✅ THÊM: sau khi xóa category -> quay về my-products và reload list
        onCategoryDeleted={async () => {
          setEditingProduct(null);
          setActiveSubTab('my-products');
          await loadProducts();
          if (onDataChange) onDataChange();
        }}
      />
    );
  }


  if (loading) return (
    <div className="product-management">
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Đang tải sản phẩm...</p>
      </div>
    </div>
  );

  return (
    <div className="product-management">
      <div className="product-management-content">
        <div className="page-header-section">
          <h1 className="page-main-title">Quản Lý Sản Phẩm</h1>
          <p className="page-subtitle">Quản lý tất cả sản phẩm của bạn</p>
        </div>

        <div className="tabs-section">
          <button className={`tab-button ${activeSubTab === 'my-products' ? 'active' : ''}`} onClick={() => { setEditingProduct(null); setActiveSubTab('my-products'); }}>Sản phẩm của tôi</button>
          <button className={`tab-button ${activeSubTab === 'add-product' ? 'active' : ''}`} onClick={() => { setEditingProduct(null); setActiveSubTab('add-product'); }}>Thêm sản phẩm</button>
          <button className="tab-button" onClick={() => setActiveSubTab('violations')}>Vi phạm</button>
        </div>

        <form
          className="filters-card"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="filters-grid">
            <div>
              <label className="filter-label">Tên sản phẩm</label>
              <input
                className="filter-input"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Nhập tên sản phẩm..."
              />
            </div>

            <div>
              <label className="filter-label">Danh mục</label>
              <input
                className="filter-input"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                placeholder="Nhập danh mục..."
              />
            </div>

            <div>
              <label className="filter-label">Số lượng</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  className="filter-input"
                  style={{ flex: 1 }}
                  value={filters.quantityMin}
                  onChange={(e) => handleFilterChange('quantityMin', e.target.value)}
                  placeholder="Tối thiểu"
                  min="0"
                />
                <input
                  type="number"
                  className="filter-input"
                  style={{ flex: 1 }}
                  value={filters.quantityMax}
                  onChange={(e) => handleFilterChange('quantityMax', e.target.value)}
                  placeholder="Tối đa"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="filter-label">Giá (VNĐ)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  className="filter-input"
                  style={{ flex: 1 }}
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  placeholder="Tối thiểu"
                  min="0"
                />
                <input
                  type="number"
                  className="filter-input"
                  style={{ flex: 1 }}
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  placeholder="Tối đa"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="filter-actions-row">
            <button className="filter-search-btn" type="submit" disabled={loading}>
              🔍 Tìm kiếm
            </button>

            <button
              className="filter-reset-btn"
              type="button"
              onClick={handleReset}
              disabled={loading || isFilterEmpty(filters)}
              title={isFilterEmpty(filters) ? 'Không có bộ lọc để đặt lại' : 'Đặt lại bộ lọc'}
            >
              ↻ Đặt lại
            </button>

            <div className="total-results" aria-live="polite">
              <span className="result-count">{groupedProducts.length}</span> sản phẩm
            </div>
          </div>
        </form>


        <div className="products-table-card">
          <table className="data-table" aria-label="Danh sách sản phẩm">
            {/* colgroup to lock proportions and prevent CSS override misalignment */}
            <colgroup>
              <col style={{ width: "30%" }} /> {/* Sản phẩm */}
              <col style={{ width: "14%" }} /> {/* Danh mục */}
              <col style={{ width: "12%" }} /> {/* Giá */}
              <col style={{ width: "10%" }} /> {/* Số lượng */}
              <col style={{ width: "8%" }} />  {/* Variants */}
              <col style={{ width: "10%" }} /> {/* Đánh giá */}
              <col style={{ width: "8%" }} /> {/* Trạng thái */}
              <col style={{ width: "8%" }} />  {/* Thao tác */}
            </colgroup>

            <thead>
              <tr>
                <th className="col-product">Sản phẩm</th>
                <th className="col-category">Danh mục</th>
                <th className="col-price">Giá</th>
                <th className="col-quantity">Số lượng</th>
                <th className="col-variants">Variants</th>
                <th className="col-rating">Đánh giá</th>
                <th className="col-status">Trạng thái</th>
                <th className="col-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {groupedProducts.map(({ product, variants }) => {
                const pid = product.id;
                const isExpanded = !!expanded[pid];
                const priceText = computePriceRangeText(product, variants);
                const totalStock = computeTotalStock(product, variants);
                const variantsCount = Array.isArray(variants) ? variants.length : 0;

                return (
                  <React.Fragment key={pid}>
                    <tr className="table-row parent-row" role="row">
                      <td className="product-cell col-product">
                        <div className="product-main">
                          <button
                            className={`expand-btn ${isExpanded ? "open" : ""}`}
                            onClick={() => toggleExpand(pid)}
                            aria-label={isExpanded ? "Thu gọn variants" : "Mở variants"}
                          >
                            {isExpanded ? "▾" : "▸"}
                          </button>

                          <img src={getProductImage(product)} alt={product.name} className="product-thumbnail" />

                          <div className="product-text">
                            <div className="product-name">{product.name}</div>
                            <div className="product-brand">{product.brand || "—"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="category-cell col-category">
                        {product.category || product.categoryName || "—"}
                      </td>

                      <td className="price-cell col-price">{priceText}</td>

                      <td className="quantity-cell col-quantity">
                        <span className={totalStock <= LOW_STOCK_THRESHOLD ? "low-stock-badge" : ""}>
                          {totalStock}
                        </span>
                      </td>

                      <td className="variants-cell col-variants" title={variantsCount ? `${variantsCount} variants` : "Không có variant"}>
                        {variantsCount}
                      </td>

                      <td className="rating-cell col-rating">{"★".repeat(5)}</td>

                      <td className="status-cell col-status">
                        {(() => {
                          const st = getStockStatus(totalStock);
                          return <span className={`status-indicator ${st.key}`}>{st.label}</span>;
                        })()}
                      </td>

                      <td className="actions-cell col-actions">
                        <div className="action-buttons-group">
                          <button className="action-edit-btn" onClick={() => handleEditProduct(pid)} title="Chỉnh sửa">✏️</button>
                          <button className="action-delete-btn" onClick={() => handleDeleteProduct(pid)} title="Xóa">🗑️</button>
                        </div>
                      </td>
                    </tr>


                    {isExpanded && variantsCount > 0 && (
                      <tr className="variant-subrow">
                        <td colSpan={8} className="variant-subcell">
                          <div className="variant-panel">
                            <div className="variant-panel-title">
                              Variants ({variantsCount})
                            </div>

                            <div className="variant-grid">
                              {variants.map((v, idx) => {
                                const vid = v.id ?? `${pid}-v-${idx}`;
                                const vPriceText =
                                  v.price !== undefined && v.price !== null
                                    ? `${formatPrice(Number(v.price))} VNĐ`
                                    : "—";
                                const vStock = Number(v.stock ?? v.quantity ?? 0);
                                const vSize = v.size ?? (v.attributes && v.attributes.size) ?? "";
                                const vColor = v.color ?? (v.attributes && v.attributes.color) ?? "";

                                const metaParts = [];
                                if (vSize) metaParts.push(`Size: ${vSize}`);
                                if (vColor) metaParts.push(`Color: ${vColor}`);
                                if (v.attributes) {
                                  const other = Object.entries(v.attributes)
                                    .filter(([k]) => k !== "size" && k !== "color")
                                    .map(([k, val]) => `${k}:${val}`);
                                  if (other.length) metaParts.push(other.join(" • "));
                                }

                                const st = getStockStatus(vStock);

                                return (
                                  <div key={vid} className="variant-card">
                                    <div className="variant-left">
                                      <img
                                        className="variant-thumb"
                                        src={v.thumbnail || product.thumbnail || placeholderImage}
                                        alt={v.sku || String(vid)}
                                      />
                                      <div className="variant-info">
                                        <div className="variant-sku">{v.sku ?? `Variant ${idx + 1}`}</div>
                                        <div className="variant-meta">{metaParts.join(" • ") || "—"}</div>
                                      </div>
                                    </div>

                                    <div className="variant-right">
                                      <div className="variant-kv">
                                        <span className="k">Giá</span>
                                        <span className="v">{vPriceText}</span>
                                      </div>
                                      <div className="variant-kv">
                                        <span className="k">SL</span>
                                        <span className="v">{vStock}</span>
                                      </div>
                                      <span className={`status-indicator ${st.key}`}>{st.label}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}


                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
