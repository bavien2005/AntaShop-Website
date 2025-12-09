import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './RevenueStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function formatCurrency(v) {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  } catch (e) {
    return v;
  }
}

// Dummy data generators
const generateRevenueData = () => {
  const months = ['01/2024', '02/2024', '03/2024', '04/2024', '05/2024', '06/2024',
                 '07/2024', '08/2024', '09/2024', '10/2024', '11/2024', '12/2024'];
  const actualRevenue = months.map(() => Math.floor(Math.random() * 50000000) + 10000000);
  const expectedRevenue = actualRevenue.map(val => val + Math.floor(Math.random() * 20000000) - 5000000);

  return { months, actualRevenue, expectedRevenue };
};

const generateDailyData = () => {
  const days = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  const revenue = days.map(() => Math.floor(Math.random() * 2000000) + 500000);

  return { days, revenue };
};

const generateCartData = () => {
  const categories = ['Giày Sneaker', 'Giày Thể Thao', 'Giày Công Sở', 'Giày Casual', 'Giày Đá Banh'];
  const expectedRevenue = categories.map(() => Math.floor(Math.random() * 15000000) + 2000000);

  return { categories, expectedRevenue };
};

export default function RevenueStats() {
  const [loading, setLoading] = useState(true);
  const [actualRevenueData, setActualRevenueData] = useState(null);
  const [expectedRevenueData, setExpectedRevenueData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      const { months, actualRevenue, expectedRevenue } = generateRevenueData();
      const { days, revenue: dailyRevenue } = generateDailyData();
      const { categories, expectedRevenue: cartRevenue } = generateCartData();

      // Chart 1: Actual Revenue (Line Chart - Daily)
      const actualData = {
        labels: days,
        datasets: [{
          label: 'Doanh thu thực tế (VNĐ)',
          data: dailyRevenue,
          borderColor: 'rgba(14, 165, 233, 1)',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          tension: 0.4,
          fill: true
        }]
      };

      const actualOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Doanh thu thực tế theo ngày',
            font: { size: 16, weight: 'bold' },
            padding: { top: 10, bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return formatCurrency(context.parsed.y);
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                return (value / 1000000).toFixed(0) + 'M';
              }
            }
          }
        }
      };

      // Chart 2: Expected Revenue from Cart (Bar Chart)
      const expectedData = {
        labels: categories,
        datasets: [{
          label: 'Doanh thu dự kiến từ giỏ hàng (VNĐ)',
          data: cartRevenue,
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };

      const expectedOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Doanh thu dự kiến từ sản phẩm trong giỏ hàng',
            font: { size: 16, weight: 'bold' },
            padding: { top: 10, bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return formatCurrency(context.parsed.y);
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                return (value / 1000000).toFixed(0) + 'M';
              }
            }
          }
        }
      };

      // Chart 3: Comparison (Actual vs Expected - Monthly)
      const comparisonChartData = {
        labels: months,
        datasets: [
          {
            label: 'Doanh thu thực tế',
            data: actualRevenue,
            backgroundColor: 'rgba(14, 165, 233, 0.8)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Doanh thu dự kiến',
            data: expectedRevenue,
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      };

      const comparisonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'So sánh doanh thu thực tế vs dự kiến',
            font: { size: 16, weight: 'bold' },
            padding: { top: 10, bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                return (value / 1000000).toFixed(0) + 'M';
              }
            }
          }
        }
      };

      setActualRevenueData({ data: actualData, options: actualOptions });
      setExpectedRevenueData({ data: expectedData, options: expectedOptions });
      setComparisonData({ data: comparisonChartData, options: comparisonOptions });
      setLoading(false);
    }, 1000);
  }, []);

  const totalActualRevenue = actualRevenueData?.data?.datasets[0]?.data?.reduce((sum, val) => sum + val, 0) || 0;
  const totalExpectedRevenue = expectedRevenueData?.data?.datasets[0]?.data?.reduce((sum, val) => sum + val, 0) || 0;

  return (
    <div className="revenue-stats-container">
      <div className="stats-header">
        <h2 className="stats-title">Thống kê doanh thu</h2>
        <div className="stats-summary">
          <div className="summary-item">
            <div className="summary-label">Thực tế (30 ngày)</div>
            <div className="summary-value">{(totalActualRevenue / 1000000).toFixed(1)}M</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Dự kiến từ giỏ hàng</div>
            <div className="summary-value">{(totalExpectedRevenue / 1000000).toFixed(1)}M</div>
          </div>
        </div>
      </div>

      <div className="stats-content">
        <div className="chart-grid">
          {/* Chart 1: Actual Revenue */}
          <div className="chart-card">
            <div className="chart-container">
              {loading ? (
                <div className="loading-state">Đang tải dữ liệu...</div>
              ) : (
                <Line data={actualRevenueData.data} options={actualRevenueData.options} />
              )}
            </div>
          </div>

          {/* Chart 2: Expected Revenue from Cart */}
          <div className="chart-card">
            <div className="chart-container">
              {loading ? (
                <div className="loading-state">Đang tải dữ liệu...</div>
              ) : (
                <Bar data={expectedRevenueData.data} options={expectedRevenueData.options} />
              )}
            </div>
          </div>

          {/* Chart 3: Comparison */}
          <div className="chart-card full-width">
            <div className="chart-container">
              {loading ? (
                <div className="loading-state">Đang tải dữ liệu...</div>
              ) : (
                <Bar data={comparisonData.data} options={comparisonData.options} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
