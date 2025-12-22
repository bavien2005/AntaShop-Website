import React, { useEffect, useState } from 'react';
import adminProductService from '../services/admin/productService';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ProductStats.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23f3f4f6" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="20">No Img</text></svg>';

function formatCurrency(v) {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  } catch (e) {
    return v;
  }
}

export default function ProductStats({ topN = 15, maxStockAxis = 1000 }) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [featuredList, setFeaturedList] = useState([]);
  const [totalStockSum, setTotalStockSum] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await adminProductService.getProducts({ page: 1, size: 500 });
        if (!res.success) throw new Error(res.error || 'Không lấy được danh sách sản phẩm');
        const products = res.data || [];
        const soldRes = await adminProductService.getSoldQtyByProduct();
        const soldRows = soldRes.success ? (soldRes.data || []) : [];
        const soldMap = new Map(
          soldRows
            .filter(r => r && r.productId != null)
            .map(r => [Number(r.productId), Number(r.soldQty || 0)])
        );
        // Normalize items: ensure numbers
        const items = products.map(p => {
          const price = Number(p.price || 0);
          const totalStock = Number(p.totalStock ?? p.quantity ?? 0);
          const thumbnail = (p.thumbnail && String(p.thumbnail)) || (Array.isArray(p.images) && p.images[0]) || null;

          const idNum = Number(p.id);
          const soldQty = soldMap.get(idNum) || 0;

          return {
            id: idNum,
            name: p.name || `#${p.id}`,
            price,
            soldQty,        // ✅ NEW
            totalStock,
            thumbnail
          };
        });

        // choose top by totalStock (or by sales if prefer)
        // We'll pick top by (sales or totalStock) combination to surface interesting products.
        items.sort((a, b) => {
          return (b.soldQty - a.soldQty) || (b.totalStock - a.totalStock) || b.price - a.price;
        });

        const top = items.slice(0, topN);

        const labels = top.map(t => (t.name.length > 50 ? t.name.slice(0, 47) + '...' : t.name));
        const stockValues = top.map(t => t.totalStock);
        const soldValues = top.map(t => t.soldQty);

        // compute total stock across all products (use items, not only top)
        const totalStockAll = items.reduce((s, it) => s + (Number(it.totalStock) || 0), 0);

        const data = {
          labels,
          datasets: [
            {
              label: 'Tồn kho',
              data: stockValues,
              backgroundColor: 'rgba(14,165,164,0.9)',
              barThickness: 14
            },
            {
              label: 'Đã bán',
              data: soldValues,
              backgroundColor: 'rgba(34,139,230,0.85)',
              barThickness: 14
            }
          ]
        };

        const options = {
          indexAxis: 'y', // horizontal bars
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const v = context.parsed.x ?? context.parsed;
                  if (label === 'Tồn kho' || label === 'Đã bán') {
                    return `${label}: ${v}`;
                  }
                  return `${label}: ${v}`;
                }
              }
            },
            title: {
              display: true,
              text: 'So sánh tồn kho và số đã bán (Top sản phẩm)',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              // Remove max constraint to let chart auto-scale based on data
              ticks: {
                // show thousands with suffix
                callback: function (val) {
                  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
                  return val;
                }
              }
            },
            y: {
              ticks: { autoSkip: false }
            }
          }
        };

        if (mounted) {
          const maxSold = items.length ? Math.max(...items.map(x => x.soldQty)) : 0;
          const featured = maxSold > 0 ? items.filter(x => x.soldQty === maxSold) : [];

          setChartData({ data, options });
          setFeaturedList(featured);
          setTotalStockSum(totalStockAll);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || 'Lỗi khi tải dữ liệu');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [topN, maxStockAxis]);

  return (
    <div className="product-stats-container">
      <div className="stats-header">
        <h2 className="stats-title">Thống kê sản phẩm</h2>
        <div className="stats-summary">
          <div className="summary-item">
            <div className="summary-label">Tổng tồn kho</div>
            <div className="summary-value">{totalStockSum.toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Top sản phẩm</div>
            <div className="summary-value">{topN}</div>
          </div>
        </div>
      </div>

      <div className="stats-content">
        <div className="chart-section">
          <div className="chart-container">
            {loading && <div className="loading-state">Đang tải dữ liệu...</div>}
            {error && <div className="error-state">Lỗi: {error}</div>}
            {!loading && !error && chartData && (
              <Bar data={chartData.data} options={chartData.options} />
            )}
            {!loading && !error && !chartData && <div className="no-data-state">Không có dữ liệu</div>}
          </div>
        </div>

        <h4 style={{ marginTop: 0 }}>Sản phẩm nổi bật (bán nhiều nhất)</h4>

        {featuredList.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {featuredList.map(fp => (
              <div key={fp.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                  <img
                    src={fp.thumbnail || PLACEHOLDER}
                    alt={fp.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#111' }}>{fp.name}</div>
                  <div style={{ color: '#0EA5A4', fontWeight: 700, marginTop: 8 }}>
                    {fp.price ? formatCurrency(fp.price) : '-'}
                  </div>
                  <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
                    Đã bán: <strong style={{ color: '#111' }}>{fp.soldQty}</strong>
                    <br />
                    Tồn kho: <strong style={{ color: '#111' }}>{fp.totalStock}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#777' }}>Chưa có dữ liệu “đã bán”.</div>
        )}

      </div>
    </div>
  );
}
