import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './UserStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
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
const generateUserGrowthData = () => {
  const months = ['01/2024', '02/2024', '03/2024', '04/2024', '05/2024', '06/2024',
                 '07/2024', '08/2024', '09/2024', '10/2024', '11/2024', '12/2024'];
  let cumulativeUsers = 100;
  const userGrowth = months.map(() => {
    const newUsers = Math.floor(Math.random() * 50) + 10;
    cumulativeUsers += newUsers;
    return cumulativeUsers;
  });

  return { months, userGrowth };
};

const generateTopBuyers = () => {
  const buyers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', totalSpent: 25000000, ordersCount: 15 },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', totalSpent: 18000000, ordersCount: 12 },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', totalSpent: 15000000, ordersCount: 10 },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', totalSpent: 12000000, ordersCount: 8 },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', totalSpent: 9500000, ordersCount: 7 },
    { id: 6, name: 'Đỗ Thị F', email: 'dothif@email.com', totalSpent: 8000000, ordersCount: 6 },
    { id: 7, name: 'Bùi Văn G', email: 'buivang@email.com', totalSpent: 6500000, ordersCount: 5 },
    { id: 8, name: 'Vũ Thị H', email: 'vuthih@email.com', totalSpent: 5500000, ordersCount: 4 }
  ];

  return buyers;
};

export default function UserStats() {
  const [loading, setLoading] = useState(true);
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [topBuyers, setTopBuyers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      const { months, userGrowth } = generateUserGrowthData();
      const buyers = generateTopBuyers();

      // Chart: User Growth
      const growthData = {
        labels: months,
        datasets: [{
          label: 'Tổng số người dùng',
          data: userGrowth,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      };

      const growthOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Biểu đồ tăng trưởng người dùng',
            font: { size: 16, weight: 'bold' },
            padding: { top: 10, bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Tổng người dùng: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        }
      };

      setUserGrowthData({ data: growthData, options: growthOptions });
      setTopBuyers(buyers);
      setStats({
        totalUsers: userGrowth[userGrowth.length - 1],
        newUsersThisMonth: Math.floor(Math.random() * 50) + 20,
        activeUsers: Math.floor(userGrowth[userGrowth.length - 1] * 0.7)
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="user-stats-container">
      <div className="stats-header">
        <h2 className="stats-title">Thống kê người dùng</h2>
        <div className="stats-summary">
          <div className="summary-item">
            <div className="summary-label">Tổng người dùng</div>
            <div className="summary-value">{stats.totalUsers.toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Người dùng mới (tháng này)</div>
            <div className="summary-value">{stats.newUsersThisMonth}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Người dùng hoạt động</div>
            <div className="summary-value">{stats.activeUsers.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="stats-content">
        {/* User Growth Chart */}
        <div className="chart-section">
          <div className="chart-container">
            {loading ? (
              <div className="loading-state">Đang tải dữ liệu...</div>
            ) : (
              <Line data={userGrowthData.data} options={userGrowthData.options} />
            )}
          </div>
        </div>

        {/* Top Buyers */}
        <div className="top-buyers-section">
          <h3 className="section-title">Top người dùng mua nhiều nhất</h3>
          <div className="buyers-table-container">
            <div className="buyers-table">
              <div className="table-header">
                <div className="table-cell rank">#</div>
                <div className="table-cell name">Tên khách hàng</div>
                <div className="table-cell email">Email</div>
                <div className="table-cell orders">Đơn hàng</div>
                <div className="table-cell total">Tổng chi tiêu</div>
              </div>
              {loading ? (
                <div className="table-loading">Đang tải danh sách...</div>
              ) : (
                topBuyers.map((buyer, index) => (
                  <div key={buyer.id} className="table-row">
                    <div className="table-cell rank">
                      <span className="rank-badge">{index + 1}</span>
                    </div>
                    <div className="table-cell name">{buyer.name}</div>
                    <div className="table-cell email">{buyer.email}</div>
                    <div className="table-cell orders">{buyer.ordersCount}</div>
                    <div className="table-cell total">{formatCurrency(buyer.totalSpent)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
