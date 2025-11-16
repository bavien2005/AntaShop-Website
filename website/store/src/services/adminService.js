// src/services/adminService.js
// Mock admin service with product CRUD + orders/messages/notifications + simple persistence in localStorage
// Meant for frontend-only dev until backend is ready.
import { productApi } from './api';
const ADMIN_PRODUCTS_KEY = 'anta_admin_products';
const ADMIN_ORDERS_KEY = 'anta_admin_orders';
const USE_REAL_PRODUCT_API = !!import.meta.env.VITE_PRODUCT_SERVICE_URL;
const productBase = '/api/product';
// Default sample products
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Giày ANTA KT7 - Đen',
    images: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 2990000,
    quantity: 45,
    category: 'Giày Bóng Rổ',
    rating: 5,
    status: 'active',
    sales: 128,
    description: 'Giày bóng rổ chuyên nghiệp ANTA KT7',
    variants: [
      { id: '1-1', sku: 'KT7-BLK-42', size: 42, color: 'Đen', price: 2990000, quantity: 10, image: '' },
      { id: '1-2', sku: 'KT7-BLK-43', size: 43, color: 'Đen', price: 2990000, quantity: 35, image: '' }
    ],
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: 'Áo thun ANTA Running - Trắng',
    images: ['https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 599000,
    quantity: 120,
    category: 'Áo thun',
    rating: 5,
    status: 'active',
    sales: 89,
    description: 'Áo thun chạy bộ thoáng mát',
    variants: [
      { id: '2-1', sku: 'TSH-WHT-M', size: 'M', color: 'Trắng', price: 599000, quantity: 60, image: '' },
      { id: '2-2', sku: 'TSH-WHT-L', size: 'L', color: 'Trắng', price: 599000, quantity: 60, image: '' }
    ],
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 3,
    name: 'Giày ANTA C202 GT - Xanh',
    images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1790000,
    quantity: 28,
    category: 'Giày Chạy Bộ',
    rating: 4,
    status: 'active',
    sales: 56,
    description: 'Giày chạy bộ công nghệ GT',
    variants: [
      { id: '3-1', sku: 'C202-GRN-40', size: 40, color: 'Xanh', price: 1790000, quantity: 28, image: '' }
    ],
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 4,
    name: 'Quần short ANTA Training',
    images: ['https://images.pexels.com/photos/7432926/pexels-photo-7432926.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/7432926/pexels-photo-7432926.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 450000,
    quantity: 85,
    category: 'Quần short',
    rating: 5,
    status: 'active',
    sales: 73,
    description: 'Quần short tập luyện',
    variants: [
      { id: '4-1', sku: 'SHRT-M-1', size: 'M', color: 'Đen', price: 450000, quantity: 85, image: '' }
    ],
    createdAt: new Date('2024-02-10').toISOString()
  },
  {
    id: 5,
    name: 'Balo ANTA Sport - Đen',
    images: ['https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 890000,
    quantity: 12,
    category: 'Phụ kiện',
    rating: 4,
    status: 'low-stock',
    sales: 34,
    description: 'Balo thể thao đa năng',
    variants: [
      { id: '5-1', sku: 'BALO-BLK', size: null, color: 'Đen', price: 890000, quantity: 12, image: '' }
    ],
    createdAt: new Date('2024-02-15').toISOString()
  }
];

// Load products from localStorage if present (persist between reloads)
let mockProducts = [];
try {
  const stored = localStorage.getItem(ADMIN_PRODUCTS_KEY);
  mockProducts = stored ? JSON.parse(stored) : [...DEFAULT_PRODUCTS];
} catch (e) {
  mockProducts = [...DEFAULT_PRODUCTS];
}

// helper to save products
const saveProducts = () => {
  try {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(mockProducts));
  } catch (e) {
    console.error('Error saving admin products to localStorage', e);
  }
}

// ================= orders (reuse user's posted orders merge logic if needed) =================
let DEFAULT_ORDERS = [
  {
    id: 1,
    customer: 'Nguyễn Văn A',
    orderNumber: '2201223FJAOQ',
    date: '2024-12-25',
    total: 1000000,
    status: 'needs-shipping',
    products: [
      {
        id: 1,
        name: 'Giày ANTA KT7 - Đen',
        image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=80',
        price: 600000,
        quantity: 1,
        dueDate: 'Trước 28/12/2024',
        shippingService: 'J&T'
      }
    ]
  }
];
let mockOrders;
try {
  const stored = localStorage.getItem(ADMIN_ORDERS_KEY);
  mockOrders = stored ? JSON.parse(stored) : [...DEFAULT_ORDERS];
} catch (e) {
  mockOrders = [...DEFAULT_ORDERS];
}
const saveAdminOrders = (orders) => {
  try {
    localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) { console.error(e) }
}

// messages / notifications / settings (small mocked)
let mockMessages = [
  { id: 1, customer: 'Nguyễn Văn A', avatar: '👤', subject: 'Hỏi về sản phẩm', message: 'Size 42 còn không?', time: '5 phút trước', date: new Date().toISOString(), read: false, replies: [] }
];
let mockNotifications = [
  { id: 1, type: 'order', icon: '📦', title: 'Đơn hàng mới', message: 'Bạn có 1 đơn hàng mới cần xử lý', time: '5 phút trước', date: new Date().toISOString(), read: false }
];
let mockSettings = {
  storeName: 'ANTA Store',
  email: 'admin@anta.com.vn',
  phone: '1900 xxxx',
  address: 'Hà Nội, Việt Nam',
  notifications: { newOrders: true, messages: true, weeklyReport: false }
};

// small delay util
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ----------------- Products Service (mock) -----------------
export const adminProductService = {
  getProducts: async (filters = {}) => {
    // try real product-service first
    if (USE_REAL_PRODUCT_API) {
      try {
        const res = await productApi.get(`${productBase}/all`, { params: filters });
        const data = res.data;
        const list = Array.isArray(data) ? data : (data.items || data.data || []);
        // normalize shape a little so FE table works (image, price, quantity)
        const normalized = list.map(p => ({
          id: p.id,
          name: p.name,
          images: p.images || (p.image ? [p.image] : []),
          thumbnail: p.thumbnail || (p.images && p.images[0]) || p.image || '',
          price: Number(p.price || 0),
          quantity: p.totalStock ?? p.quantity ?? 0,
          category: p.category || p.categories || '',
          rating: p.rating ?? 5,
          status: p.status || ((p.totalStock && p.totalStock <= 5) ? 'low-stock' : 'active'),
          sales: p.sales ?? 0,
          description: p.description || '',
          variants: p.variants || []
        }));
        return { success: true, data: normalized };
      } catch (err) {
        console.warn('[adminProductService] productApi.getProducts failed, fallback to mock:', err?.message);
        // fallthrough to mock
      }
    }

    // fallback mock behavior
    try {
      // reuse existing mock filtering logic (same as your current getProducts)
      let filtered = [...mockProducts];

      if (filters.name) filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.name.toLowerCase()));
      if (filters.category) filtered = filtered.filter(p => (p.category || '').toLowerCase().includes(filters.category.toLowerCase()));
      if (filters.quantityMin) filtered = filtered.filter(p => (p.quantity || 0) >= parseInt(filters.quantityMin));
      if (filters.quantityMax) filtered = filtered.filter(p => (p.quantity || 0) <= parseInt(filters.quantityMax));
      if (filters.priceMin) filtered = filtered.filter(p => (p.price || 0) >= parseInt(filters.priceMin) * 1000);
      if (filters.priceMax) filtered = filtered.filter(p => (p.price || 0) <= parseInt(filters.priceMax) * 1000);

      return { success: true, data: filtered };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  getProduct: async (id) => {
    if (USE_REAL_PRODUCT_API) {
      try {
        const res = await productApi.get(`${productBase}/${id}`);
        const p = res.data;
        const normalized = {
          id: p.id,
          name: p.name,
          images: p.images || (p.image ? [p.image] : []),
          thumbnail: p.thumbnail || (p.images && p.images[0]) || p.image || '',
          price: Number(p.price || 0),
          quantity: p.totalStock ?? p.quantity ?? 0,
          category: p.category || '',
          rating: p.rating ?? 5,
          status: p.status || ((p.totalStock && p.totalStock <= 5) ? 'low-stock' : 'active'),
          sales: p.sales ?? 0,
          description: p.description || '',
          variants: p.variants || []
        };
        return { success: true, data: normalized };
      } catch (err) {
        console.warn('[adminProductService] productApi.getProduct failed, fallback to mock:', err?.message);
        // fallthrough
      }
    }

    await delay();
    const product = mockProducts.find(p => String(p.id) === String(id));
    if (product) return { success: true, data: product };
    return { success: false, error: 'Không tìm thấy sản phẩm' };
  },

  createProduct: async (productData) => {
    // try real API first
    if (USE_REAL_PRODUCT_API) {
      try {
        // Format payload to backend expected shape if necessary (images array, variants, price, totalStock etc.)
        const payload = {
          name: productData.name,
          description: productData.description,
          price: Number(productData.price || 0),
          categories: productData.category ? [productData.category] : (productData.categories || []),
          images: productData.images || (productData.image ? [productData.image] : []),
          variants: productData.variants || [], // if BE supports variants
          totalStock: productData.quantity ?? undefined
        };
        const res = await productApi.post(`${productBase}/add`, payload);
        const created = res.data;
        // normalize (similar to above)
        const normalized = {
          id: created.id,
          name: created.name,
          images: created.images || (created.image ? [created.image] : []),
          thumbnail: created.thumbnail || (created.images && created.images[0]) || created.image || '',
          price: Number(created.price || 0),
          quantity: created.totalStock ?? created.quantity ?? 0,
          category: created.category || (created.categories && created.categories[0]) || '',
          rating: created.rating ?? 5,
          status: created.status || 'active',
          sales: created.sales ?? 0,
          description: created.description || '',
          variants: created.variants || []
        };
        return { success: true, data: normalized, message: 'Thêm sản phẩm thành công' };
      } catch (err) {
        console.warn('[adminProductService] productApi.createProduct failed, fallback to mock:', err?.message);
      }
    }

    // fallback mock create (your existing logic)
    await delay();
    try {
      const newId = mockProducts.length ? Math.max(...mockProducts.map(p => p.id)) + 1 : 1;
      const variants = Array.isArray(productData.variants) ? productData.variants : [];
      const totalQuantity = variants.length ? variants.reduce((s, v) => s + (Number(v.quantity) || 0), 0) : (Number(productData.quantity) || 0);
      const price = variants.length ? Math.min(...variants.map(v => Number(v.price) || Infinity)) : Number(productData.price) || 0;

      const newProduct = {
        id: newId,
        name: productData.name,
        description: productData.description || '',
        images: productData.images || (productData.image ? [productData.image] : []),
        thumbnail: (productData.images && productData.images[0]) || productData.image || '',
        price,
        quantity: totalQuantity,
        category: productData.category || productData.categories || '',
        rating: productData.rating ?? 5,
        status: productData.status || (totalQuantity < 20 ? 'low-stock' : 'active'),
        sales: productData.sales || 0,
        variants: variants.map((v, idx) => ({
          id: v.id || `${newId}-${idx+1}`,
          sku: v.sku || `SKU-${newId}-${idx+1}`,
          size: v.size || null,
          color: v.color || null,
          price: Number(v.price) || price,
          quantity: Number(v.quantity) || 0,
          image: v.image || ''
        })),
        createdAt: new Date().toISOString()
      };

      mockProducts.push(newProduct);
      saveProducts();
      return { success: true, data: newProduct, message: 'Thêm sản phẩm thành công (mock)' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  updateProduct: async (id, productData) => {
    if (USE_REAL_PRODUCT_API) {
      try {
        const payload = {
          name: productData.name,
          description: productData.description,
          price: Number(productData.price || 0),
          categories: productData.category ? [productData.category] : (productData.categories || []),
          images: productData.images || (productData.image ? [productData.image] : []),
          variants: productData.variants || [],
          totalStock: productData.quantity ?? undefined
        };
        const res = await productApi.put(`${productBase}/update/${id}`, payload);
        const updated = res.data;
        const normalized = {
          id: updated.id,
          name: updated.name,
          images: updated.images || (updated.image ? [updated.image] : []),
          thumbnail: updated.thumbnail || (updated.images && updated.images[0]) || updated.image || '',
          price: Number(updated.price || 0),
          quantity: updated.totalStock ?? updated.quantity ?? 0,
          category: updated.category || (updated.categories && updated.categories[0]) || '',
          rating: updated.rating ?? 5,
          status: updated.status || 'active',
          sales: updated.sales ?? 0,
          description: updated.description || '',
          variants: updated.variants || []
        };
        return { success: true, data: normalized, message: 'Cập nhật sản phẩm thành công' };
      } catch (err) {
        console.warn('[adminProductService] productApi.updateProduct failed, fallback to mock:', err?.message);
      }
    }

    // fallback mock update (your existing logic)
    await delay();
    try {
      const idx = mockProducts.findIndex(p => String(p.id) === String(id));
      if (idx === -1) return { success: false, error: 'Không tìm thấy sản phẩm' };
      const existing = mockProducts[idx];
      const merged = { ...existing, ...productData };

      if (Array.isArray(productData.variants)) {
        merged.variants = productData.variants.map((v, i) => ({
          id: v.id || `${merged.id}-${i+1}`,
          sku: v.sku || `SKU-${merged.id}-${i+1}`,
          size: v.size || null,
          color: v.color || null,
          price: Number(v.price) || Number(merged.price) || 0,
          quantity: Number(v.quantity) || 0,
          image: v.image || ''
        }));
        merged.quantity = merged.variants.reduce((s, v) => s + (Number(v.quantity) || 0), 0);
        merged.price = merged.variants.length ? Math.min(...merged.variants.map(v => v.price || Infinity)) : merged.price;
      } else {
        merged.quantity = Number(productData.quantity ?? merged.quantity ?? 0);
      }

      mockProducts[idx] = merged;
      saveProducts();
      return { success: true, data: merged, message: 'Cập nhật sản phẩm thành công (mock)' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  deleteProduct: async (id) => {
    if (USE_REAL_PRODUCT_API) {
      try {
        const res = await productApi.delete(`${productBase}/delete/${id}`);
        return { success: true, data: res.data, message: 'Xóa sản phẩm thành công' };
      } catch (err) {
        console.warn('[adminProductService] productApi.deleteProduct failed, fallback to mock:', err?.message);
      }
    }

    await delay();
    try {
      const idx = mockProducts.findIndex(p => String(p.id) === String(id));
      if (idx === -1) return { success: false, error: 'Không tìm thấy sản phẩm' };
      mockProducts.splice(idx, 1);
      saveProducts();
      return { success: true, message: 'Xóa sản phẩm thành công (mock)' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};


// ----------------- Settings Service (mock) -----------------
export const adminSettingsService = {
  getSettings: async () => {
    await delay();
    try {
      return { success: true, data: mockSettings };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  updateSettings: async (settingsData) => {
    await delay();
    try {
      mockSettings = { ...mockSettings, ...settingsData };
      return { success: true, data: mockSettings, message: 'Lưu cài đặt thành công (mock)' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

export const adminOrderService = {
  getOrders: async (filters = {}) => {
    await delay();
    try {
      let list = [...mockOrders];
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(o => (o.orderNumber||'').toLowerCase().includes(q) || (o.customer||'').toLowerCase().includes(q));
      }
      if (filters.status && filters.status !== 'all') {
        list = list.filter(o => o.status === filters.status);
      }
      // newest first
      list.sort((a,b) => new Date(b.date) - new Date(a.date));
      return { success: true, data: list };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  getOrder: async (id) => {
    await delay();
    try {
      const o = mockOrders.find(x => String(x.id) === String(id));
      if (!o) return { success: false, error: 'Không tìm thấy đơn hàng' };
      return { success: true, data: o };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  createOrder: async (orderData) => {
    await delay();
    try {
      const newId = mockOrders.length ? Math.max(...mockOrders.map(o => o.id)) + 1 : 1;
      const newOrder = {
        id: newId,
        customer: orderData.customer?.fullName || 'Khách hàng',
        orderNumber: orderData.orderNumber || `ANT${Date.now().toString().slice(-8)}`,
        date: new Date().toISOString().split('T')[0],
        total: orderData.total || 0,
        status: 'needs-shipping',
        products: orderData.items || []
      };
      mockOrders.unshift(newOrder);
      saveAdminOrders(mockOrders);
      return { success: true, data: newOrder, message: 'Đơn hàng tạo thành công (mock)' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  updateOrderStatus: async (id, status) => {
    await delay();
    try {
      const idx = mockOrders.findIndex(o => String(o.id) === String(id));
      if (idx === -1) return { success: false, error: 'Không tìm thấy đơn hàng' };
      mockOrders[idx].status = status;
      // adjust product dueDate/shippingService for display
      if (mockOrders[idx].products) {
        mockOrders[idx].products.forEach(p => {
          if (status === 'cancelled') { p.dueDate = 'Đã hủy'; p.shippingService = 'Đã hủy'; }
          else if (status === 'completed') { p.dueDate = 'Đã hoàn thành'; p.shippingService = 'Đã giao'; }
          else if (status === 'sent') { p.dueDate = 'Đang giao hàng'; p.shippingService = p.shippingService || 'Đang giao'; }
        });
      }
      saveAdminOrders(mockOrders);
      return { success: true, data: mockOrders[idx], message: 'Cập nhật trạng thái thành công (mock)' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  arrangeShipping: async (orderId, shippingData) => {
    await delay();
    try {
      const idx = mockOrders.findIndex(o => String(o.id) === String(orderId));
      if (idx === -1) return { success: false, error: 'Không tìm thấy đơn hàng' };
      mockOrders[idx].status = 'sent';
      mockOrders[idx].shippingInfo = shippingData;
      if (mockOrders[idx].products) {
        mockOrders[idx].products.forEach(p => {
          p.dueDate = 'Đang giao hàng';
          p.shippingService = shippingData.service || 'J&T Express';
        });
      }
      saveAdminOrders(mockOrders);
      return { success: true, data: mockOrders[idx], message: 'Sắp xếp giao hàng thành công (mock)' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

// ----------------- Messages Service (mock) -----------------
export const adminMessageService = {
  getMessages: async (filters = {}) => {
    await delay();
    try {
      let list = [...mockMessages];
      if (filters.unreadOnly) list = list.filter(m => !m.read);
      return { success: true, data: list };
    } catch (err) { return { success: false, error: err.message }; }
  },

  getMessage: async (id) => {
    await delay();
    const m = mockMessages.find(x => String(x.id) === String(id));
    return m ? { success: true, data: m } : { success: false, error: 'Không tìm thấy tin nhắn' };
  },

  markAsRead: async (id) => {
    await delay();
    const idx = mockMessages.findIndex(m => String(m.id) === String(id));
    if (idx === -1) return { success: false, error: 'Không tìm thấy tin nhắn' };
    mockMessages[idx].read = true;
    return { success: true, data: mockMessages[idx] };
  },

  replyToMessage: async (id, replyText) => {
    await delay();
    const idx = mockMessages.findIndex(m => String(m.id) === String(id));
    if (idx === -1) return { success: false, error: 'Không tìm thấy tin nhắn' };
    const reply = { id: mockMessages[idx].replies.length + 1, sender: 'admin', message: replyText, time: 'Vừa xong' };
    mockMessages[idx].replies.push(reply);
    mockMessages[idx].read = true;
    return { success: true, data: mockMessages[idx], message: 'Gửi phản hồi thành công' };
  }
};

// ----------------- Notifications Service (mock) -----------------
export const adminNotificationService = {
  getNotifications: async (filters = {}) => {
    await delay();
    try {
      let list = [...mockNotifications];
      if (filters.unreadOnly) list = list.filter(n => !n.read);
      return { success: true, data: list };
    } catch (err) { return { success: false, error: err.message }; }
  },

  markAsRead: async (id) => {
    await delay();
    const idx = mockNotifications.findIndex(n => String(n.id) === String(id));
    if (idx === -1) return { success: false, error: 'Không tìm thấy thông báo' };
    mockNotifications[idx].read = true;
    return { success: true, data: mockNotifications[idx] };
  },

  markAllAsRead: async () => {
    await delay();
    mockNotifications.forEach(n => n.read = true);
    return { success: true, message: 'Đã đánh dấu tất cả thông báo là đã đọc' };
  }
};



// ----------------- Stats Service (mock) -----------------
export const adminStatsService = {
  getDashboardStats: async () => {
    await delay();
    try {
      const stats = {
        totalProducts: mockProducts.length,
        totalOrders: mockOrders.length,
        newOrders: mockOrders.filter(o => o.status === 'needs-shipping').length,
        completedOrders: mockOrders.filter(o => o.status === 'completed').length,
        totalRevenue: mockOrders.reduce((s,o) => s + (o.total||0), 0),
        totalCustomers: new Set(mockOrders.map(o => o.customer)).size,
        unreadMessages: mockMessages.filter(m => !m.read).length,
        unreadNotifications: mockNotifications.filter(n => !n.read).length,
        lowStockProducts: mockProducts.filter(p => (p.quantity||0) < 20).length
      };
      return { success: true, data: stats };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
// default export similar to your api wrapper naming
export default {
  products: adminProductService,
  orders: adminOrderService,
  messages: adminMessageService,
  notifications: adminNotificationService,
  settings: adminSettingsService,
  stats: adminStatsService
};
