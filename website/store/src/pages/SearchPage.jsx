// src/pages/SearchPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Layout } from "../components";
import "./SearchPage.css";
import { productService } from "../services/api";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [filters, setFilters] = useState({
    category: [],
    price: "",
    size: [],
    color: [],
    brand: [],
  });

  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------- helpers ----------
  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const getImage = (p) => {
    return (
      p?.thumbnail ||
      (Array.isArray(p?.images) && p.images[0]) ||
      "https://via.placeholder.com/600x600?text=No+Image"
    );
  };

  const getVariantSizes = (p) => {
    const variants = Array.isArray(p?.variants) ? p.variants : [];
    return variants.map((v) => v?.size).filter(Boolean);
  };

  const getVariantColors = (p) => {
    const variants = Array.isArray(p?.variants) ? p.variants : [];
    return variants.map((v) => v?.color).filter(Boolean);
  };

  // ---------- fetch products by query ----------
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      try {
        const data = await productService.searchProducts(query);
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!mounted) return;
        setProducts([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [query]);

  // ---------- filters handlers ----------
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[filterType])) {
        const currentValues = prev[filterType];
        if (currentValues.includes(value)) {
          return { ...prev, [filterType]: currentValues.filter((v) => v !== value) };
        }
        return { ...prev, [filterType]: [...currentValues, value] };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      price: "",
      size: [],
      color: [],
      brand: [],
    });
  };

  // ---------- local filtering (after BE search) ----------
  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      // brand filter
      if (filters.brand.length > 0) {
        const b = (product?.brand || "").toString();
        if (!filters.brand.includes(b)) return false;
      }

      // price filter
      if (filters.price) {
        const [min, max] = filters.price.split("-").map(Number);
        const price = safeNumber(product?.price);
        if (price < (min || 0)) return false;
        if (max && price > max) return false;
      }

      // category filter (backend bạn đang có categoryId, chưa có categoryName)
      // => chỉ filter nếu product.category tồn tại
      if (filters.category.length > 0) {
        const cat = product?.category; // nếu backend sau này trả categoryName thì tự chạy
        if (cat) {
          if (!filters.category.includes(cat)) return false;
        }
      }

      // size filter (dựa trên variants)
      if (filters.size.length > 0) {
        const sizes = getVariantSizes(product);
        const ok = filters.size.some((s) => sizes.includes(s));
        if (!ok) return false;
      }

      // color filter (dựa trên variants)
      if (filters.color.length > 0) {
        const colors = getVariantColors(product);
        const ok = filters.color.some((c) => colors.includes(c));
        if (!ok) return false;
      }

      return true;
    });
  }, [products, filters]);

  // ---------- sorting ----------
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    list.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return safeNumber(a?.price) - safeNumber(b?.price);
        case "price-desc":
          return safeNumber(b?.price) - safeNumber(a?.price);
        case "newest":
          return safeNumber(b?.id) - safeNumber(a?.id);
        default:
          return 0; // "popular": chưa có field popularity thì giữ nguyên
      }
    });
    return list;
  }, [filteredProducts, sortBy]);

  return (
    <Layout>
      <div className="search-page">
        <div className="breadcrumbs">
          <div className="container">
            <Link to="/home" className="breadcrumb-link">
              Trang chủ
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Tìm kiếm</span>
          </div>
        </div>

        <div className="search-container">
          <div className="search-header">
            <h1>Kết quả tìm kiếm {query && `cho "${query}"`}</h1>
            <p className="result-count">
              {loading ? "Đang tải..." : `${sortedProducts.length} sản phẩm`}
            </p>
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
                  {["Giày", "Áo", "Quần", "Phụ kiện"].map((category) => (
                    <label key={category} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        onChange={() => handleFilterChange("category", category)}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
                <small style={{ opacity: 0.7 }}>
                  * Danh mục chỉ lọc chính xác nếu backend trả categoryName.
                </small>
              </div>

              <div className="filter-section">
                <h4 className="filter-title">Khoảng giá</h4>
                <div className="filter-options">
                  {[
                    { label: "Dưới 500.000₫", value: "0-500000" },
                    { label: "500.000₫ - 1.000.000₫", value: "500000-1000000" },
                    { label: "1.000.000₫ - 2.000.000₫", value: "1000000-2000000" },
                    { label: "Trên 2.000.000₫", value: "2000000-999999999" },
                  ].map((range) => (
                    <label key={range.value} className="filter-radio">
                      <input
                        type="radio"
                        name="price"
                        checked={filters.price === range.value}
                        onChange={() => handleFilterChange("price", range.value)}
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-title">Kích thước</h4>
                <div className="filter-options size-grid">
                  {[39, 40, 41, 42, 43, 44, "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`size-btn ${filters.size.includes(size) ? "active" : ""}`}
                      onClick={() => handleFilterChange("size", size)}
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
                    { name: "Đen", color: "#000" },
                    { name: "Trắng", color: "#fff" },
                    { name: "Xám", color: "#808080" },
                    { name: "Đỏ", color: "#ff0000" },
                    { name: "Xanh", color: "#0000ff" },
                    { name: "Hồng", color: "#ffc0cb" },
                  ].map(({ name, color }) => (
                    <button
                      key={name}
                      type="button"
                      className={`color-btn ${filters.color.includes(name) ? "active" : ""}`}
                      onClick={() => handleFilterChange("color", name)}
                      title={name}
                    >
                      <span className="color-swatch" style={{ backgroundColor: color }} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-title">Thương hiệu</h4>
                <div className="filter-options">
                  {["ANTA"].map((brand) => (
                    <label key={brand} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={() => handleFilterChange("brand", brand)}
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
                    type="button"
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Xem dạng lưới"
                  >
                    ⊞
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="Xem dạng danh sách"
                  >
                    ☰
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="no-results">
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="no-results">
                  <p>Không tìm thấy sản phẩm</p>
                </div>
              ) : (
                <div className={`products-${viewMode}`}>
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="product-image-wrapper">
                        <img src={getImage(product)} alt={product.name || "Product"} />
                        <button type="button" className="wishlist-btn">
                          ♡
                        </button>
                      </div>

                      <div className="product-details">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-price">
                          <span className="current-price">
                            {safeNumber(product.price).toLocaleString()}₫
                          </span>
                        </div>

                        {viewMode === "list" && (
                          <div className="product-meta">
                            <p className="product-colors">
                              Màu: {getVariantColors(product).join(", ") || "—"}
                            </p>
                            <p className="product-sizes">
                              Size: {getVariantSizes(product).join(", ") || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sortedProducts.length > 0 && !loading && (
                <div className="pagination">
                  <button className="page-btn" disabled>
                    Trước
                  </button>
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
