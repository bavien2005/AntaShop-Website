import api from './api';
import { API_ENDPOINTS } from '../constants';

// Mock data storage (simulates backend)
let mockProducts = [
  {
    id: 1,
    name: 'Giày ANTA KT7 - Đen',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 2990000,
    quantity: 45,
    category: 'Giày B��ng Rổ',
    rating: 5,
    status: 'active',
    sales: 128,
    description: 'Giày bóng rổ chuyên nghiệp ANTA KT7',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: 'Áo thun ANTA Running - Trắng',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 599000,
    quantity: 120,
    category: 'Áo thun',
    rating: 5,
    status: 'active',
    sales: 89,
    description: 'Áo thun chạy bộ thoáng mát',
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 3,
    name: 'Giày ANTA C202 GT - Xanh',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1790000,
    quantity: 28,
    category: 'Giày Chạy Bộ',
    rating: 4,
    status: 'active',
    sales: 56,
    description: 'Giày chạy bộ công ngh�� GT',
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 4,
    name: 'Quần short ANTA Training',
    image: 'https://images.pexels.com/photos/7432926/pexels-photo-7432926.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 450000,
    quantity: 85,
    category: 'Quần short',
    rating: 5,
    status: 'active',
    sales: 73,
    description: 'Quần short tập luyện',
    createdAt: new Date('2024-02-10').toISOString()
  },
  {
    id: 5,
    name: 'Balo ANTA Sport - Đen',
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 890000,
    quantity: 12,
    category: 'Phụ kiện',
    rating: 4,
    status: 'low-stock',
    sales: 34,
    description: 'Balo thể thao đa năng',
    createdAt: new Date('2024-02-15').toISOString()
  }
];

const ADMIN_ORDERS_KEY = 'anta_admin_orders';

const DEFAULT_ORDERS = [
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
  },
  {
    id: 2,
    customer: 'Trần Thị B',
    orderNumber: '2197139TYQPWO',
    date: '2024-12-24',
    total: 800000,
    status: 'needs-shipping',
    products: [
      {
        id: 2,
        name: 'Áo thun ANTA Running',
        image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=80',
        price: 400000,
        quantity: 2,
        dueDate: 'Trước 27/12/2024',
        shippingService: 'GHTK'
      }
    ]
  },
  {
    id: 3,
    customer: 'Lê Văn C',
    orderNumber: '2198456ABCDE',
    date: '2024-12-23',
    total: 2990000,
    status: 'sent',
    products: [
      {
        id: 3,
        name: 'Giày ANTA C202 GT',
        image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=80',
        price: 1790000,
        quantity: 1,
        dueDate: 'Đang giao hàng',
        shippingService: 'Viettel Post'
      }
    ]
  },
  {
    id: 4,
    customer: 'Phạm Thị D',
    orderNumber: '2199678FGHIJ',
    date: '2024-12-22',
    total: 1340000,
    status: 'completed',
    products: [
      {
        id: 4,
        name: 'Quần short ANTA Training',
        image: 'https://images.pexels.com/photos/7432926/pexels-photo-7432926.jpeg?auto=compress&cs=tinysrgb&w=80',
        price: 450000,
        quantity: 2,
        dueDate: 'Đã hoàn thành',
        shippingService: 'J&T'
      }
    ]
  }
];

const getAdminOrders = () => {
  try {
    // Get admin orders
    const adminStored = localStorage.getItem(ADMIN_ORDERS_KEY);
    let adminOrders = adminStored ? JSON.parse(adminStored) : [...DEFAULT_ORDERS];

    // Get user orders and merge them
    const USER_ORDERS_KEY = 'anta_user_orders';
    const userStored = localStorage.getItem(USER_ORDERS_KEY);

    if (userStored) {
      try {
        const userOrders = JSON.parse(userStored);

        // Convert user orders to admin format and merge
        userOrders.forEach(userOrder => {
          // Check if this order already exists in admin orders
          const existingIndex = adminOrders.findIndex(ao =>
            ao.orderNumber === userOrder.id ||
            ao.id === userOrder.id ||
            ao.orderNumber === userOrder.orderNumber
          );

          // Map user order status to admin status
          let adminStatus = 'needs-shipping';
          const userStatus = userOrder.status?.toLowerCase() || '';

          if (userStatus.includes('hủy') || userStatus === 'cancelled') {
            adminStatus = 'cancelled';
          } else if (userStatus.includes('giao') && !userStatus.includes('đang')) {
            adminStatus = 'completed';
          } else if (userStatus.includes('đang giao') || userStatus === 'shipping') {
            adminStatus = 'sent';
          } else if (userStatus.includes('đang xử lý') || userStatus === 'processing') {
            adminStatus = 'needs-shipping';
          }

          const adminOrderFormat = {
            id: existingIndex !== -1 ? adminOrders[existingIndex].id : adminOrders.length + 1,
            customer: userOrder.customer?.fullName || 'Khách hàng',
            orderNumber: userOrder.orderNumber || userOrder.id,
            date: new Date(userOrder.date || userOrder.createdAt).toISOString().split('T')[0],
            orderDate: userOrder.createdAt || userOrder.date,
            total: userOrder.total || userOrder.totalAmount || 0,
            status: adminStatus,
            products: (userOrder.products || []).map(p => ({
              id: p.id,
              name: p.name,
              image: p.image,
              price: p.price,
              quantity: p.quantity || 1,
              dueDate: adminStatus === 'completed' ? 'Đã hoàn thành' :
                       adminStatus === 'sent' ? 'Đang giao hàng' :
                       adminStatus === 'cancelled' ? 'Đã hủy' : 'Chưa xác định',
              shippingService: adminStatus === 'cancelled' ? 'Đã hủy' :
                              adminStatus === 'completed' ? 'Đã giao' : 'Chờ xử lý'
            }))
          };

          if (existingIndex !== -1) {
            // Update existing order
            adminOrders[existingIndex] = { ...adminOrders[existingIndex], ...adminOrderFormat };
          } else {
            // Add new order
            adminOrders.push(adminOrderFormat);
          }
        });
      } catch (error) {
        console.error('Error merging user orders:', error);
      }
    }

    return adminOrders;
  } catch (error) {
    console.error('Error loading admin orders from localStorage:', error);
    return DEFAULT_ORDERS;
  }
};

const saveAdminOrders = (orders) => {
  try {
    localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving admin orders to localStorage:', error);
  }
};

if (!localStorage.getItem(ADMIN_ORDERS_KEY)) {
  saveAdminOrders(DEFAULT_ORDERS);
}

let mockOrders = getAdminOrders();

let mockMessages = [
  {
    id: 1,
    customer: 'Nguyễn Văn A',
    avatar: '👤',
    subject: 'Hỏi về sản phẩm Giày ANTA KT7',
    message: 'Xin chào, tôi muốn hỏi về size giày ANTA KT7. Size 42 còn hàng không ạ?',
    time: '5 phút trước',
    date: new Date().toISOString(),
    read: false,
    replies: []
  },
  {
    id: 2,
    customer: 'Trần Thị B',
    avatar: '👤',
    subject: 'Đơn hàng chậm trễ',
    message: 'Đơn hàng #2197139TYQPWO của tôi đã quá hạn giao. Vui lòng kiểm tra giúp.',
    time: '1 giờ trước',
    date: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    replies: []
  },
  {
    id: 3,
    customer: 'Lê Văn C',
    avatar: '👤',
    subject: 'Cảm ơn dịch vụ tốt',
    message: 'Sản phẩm rất tuyệt, giao hàng nhanh. Cảm ơn shop!',
    time: '2 giờ trước',
    date: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    replies: [
      {
        id: 1,
        sender: 'admin',
        message: 'Cảm ơn bạn đã tin tưởng ANTA!',
        time: '1 giờ trước'
      }
    ]
  }
];

let mockNotifications = [
  {
    id: 1,
    type: 'order',
    icon: '��',
    title: 'Đơn hàng mới #2201223FJAOQ',
    message: 'Bạn có 1 đơn hàng mới cần xử lý',
    time: '5 phút trước',
    date: new Date().toISOString(),
    read: false
  },
  {
    id: 2,
    type: 'product',
    icon: '📦',
    title: 'Sản phẩm "Giày ANTA KT7" đã được cập nhật',
    message: 'Thông tin sản phẩm đã được cập nhật thành công',
    time: '2 giờ trước',
    date: new Date(Date.now() - 7200000).toISOString(),
    read: false
  },
  {
    id: 3,
    type: 'order',
    icon: '✓',
    title: 'Đơn hàng #2197139TYQPWO đã hoàn thành',
    message: 'Khách hàng đã xác nhận nh��n hàng',
    time: '1 ngày trước',
    date: new Date(Date.now() - 86400000).toISOString(),
    read: true
  },
  {
    id: 4,
    type: 'stock',
    icon: '⚠️',
    title: 'Cảnh báo tồn kho',
    message: 'Sản phẩm "Balo ANTA Sport" sắp hết hàng (12 sản phẩm)',
    time: '2 ngày trước',
    date: new Date(Date.now() - 172800000).toISOString(),
    read: true
  }
];

let mockSettings = {
  storeName: 'ANTA Store',
  email: 'admin@anta.com.vn',
  phone: '1900 xxxx',
  address: 'Hà Nội, Việt Nam',
  notifications: {
    newOrders: true,
    messages: true,
    weeklyReport: false
  }
};

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Products Service
export const adminProductService = {
  // Get all products
  getProducts: async (filters = {}) => {
    await delay();
    try {
      let filtered = [...mockProducts];

      if (filters.name) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.category) {
        filtered = filtered.filter(p => 
          p.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }

      if (filters.quantityMin) {
        filtered = filtered.filter(p => p.quantity >= parseInt(filters.quantityMin));
      }

      if (filters.quantityMax) {
        filtered = filtered.filter(p => p.quantity <= parseInt(filters.quantityMax));
      }

      if (filters.priceMin) {
        filtered = filtered.filter(p => p.price >= parseInt(filters.priceMin) * 1000);
      }

      if (filters.priceMax) {
        filtered = filtered.filter(p => p.price <= parseInt(filters.priceMax) * 1000);
      }

      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get single product
  getProduct: async (id) => {
    await delay();
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (product) {
      return { success: true, data: product };
    }
    return { success: false, error: 'Không tìm thấy sản phẩm' };
  },

  // Create product
  createProduct: async (productData) => {
    await delay();
    try {
      const newProduct = {
        id: Math.max(...mockProducts.map(p => p.id)) + 1,
        ...productData,
        sales: 0,
        rating: 5,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      mockProducts.push(newProduct);
      return { success: true, data: newProduct, message: 'Thêm sản phẩm thành công!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    await delay();
    try {
      const index = mockProducts.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...productData };
        return { success: true, data: mockProducts[index], message: 'Cập nhật sản phẩm thành công!' };
      }
      return { success: false, error: 'Không tìm thấy sản phẩm' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    await delay();
    try {
      const index = mockProducts.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        mockProducts.splice(index, 1);
        return { success: true, message: 'Xóa sản phẩm thành công!' };
      }
      return { success: false, error: 'Không tìm thấy sản phẩm' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Orders Service
export const adminOrderService = {
  // Get all orders
  getOrders: async (filters = {}) => {
    await delay();
    try {
      // Always reload from localStorage to get fresh data
      mockOrders = getAdminOrders();
      let filtered = [...mockOrders];

      if (filters.search) {
        filtered = filtered.filter(o =>
          o.orderNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
          o.customer?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(o => o.status === filters.status);
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => {
        const dateA = new Date(a.orderDate || a.date);
        const dateB = new Date(b.orderDate || b.date);
        return dateB - dateA;
      });

      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create new order (from checkout)
  createOrder: async (orderData) => {
    await delay();
    try {
      mockOrders = getAdminOrders();
      const orderNumber = orderData.orderNumber || `ANT${Date.now().toString().slice(-8)}`;
      const newOrder = {
        id: mockOrders.length + 1,
        customer: orderData.customer.fullName,
        orderNumber: orderNumber,
        date: new Date().toISOString().split('T')[0],
        orderDate: orderData.orderDate || new Date().toISOString(),
        total: orderData.total,
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        shipping: orderData.shipping,
        promoCode: orderData.promoCode,
        status: 'needs-shipping',
        paymentMethod: orderData.customer.paymentMethod,
        shippingMethod: orderData.customer.shippingMethod,
        customerInfo: orderData.customer,
        products: orderData.items.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          dueDate: 'Chưa xác định',
          shippingService: 'Chờ xử lý'
        })),
        // Add items alias for OrderSuccessPage compatibility
        items: orderData.items.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }))
      };

      // Ensure customer field is object for OrderSuccessPage
      newOrder.customer = orderData.customer;

      mockOrders.unshift(newOrder);
      saveAdminOrders(mockOrders);
      return { success: true, data: newOrder, message: 'Đơn hàng đã được tạo thành công!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get single order
  getOrder: async (id) => {
    await delay();
    mockOrders = getAdminOrders();
    const order = mockOrders.find(o => o.id === parseInt(id));
    if (order) {
      return { success: true, data: order };
    }
    return { success: false, error: 'Không tìm thấy đơn hàng' };
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    await delay();
    try {
      mockOrders = getAdminOrders();
      const index = mockOrders.findIndex(o => o.id === parseInt(id));
      if (index !== -1) {
        mockOrders[index].status = status;

        // Update product status as well
        if (mockOrders[index].products) {
          mockOrders[index].products.forEach(p => {
            if (status === 'cancelled') {
              p.dueDate = 'Đã hủy';
              p.shippingService = 'Đã hủy';
            } else if (status === 'completed') {
              p.dueDate = 'Đã hoàn thành';
              p.shippingService = 'Đã giao';
            } else if (status === 'sent') {
              p.dueDate = 'Đang giao hàng';
              p.shippingService = p.shippingService || 'Đang giao';
            }
          });
        }

        saveAdminOrders(mockOrders);

        // Sync with user orders
        try {
          const USER_ORDERS_KEY = 'anta_user_orders';
          const userOrders = JSON.parse(localStorage.getItem(USER_ORDERS_KEY) || '[]');
          const userOrderIndex = userOrders.findIndex(uo =>
            uo.orderNumber === mockOrders[index].orderNumber ||
            uo.id === mockOrders[index].orderNumber ||
            uo.orderNumber === mockOrders[index].id
          );

          if (userOrderIndex !== -1) {
            // Map admin status to user status
            let userStatus = userOrders[userOrderIndex].status;
            if (status === 'cancelled') {
              userStatus = 'Đã hủy';
            } else if (status === 'completed') {
              userStatus = 'Đã giao';
            } else if (status === 'sent') {
              userStatus = 'Đang giao';
            } else if (status === 'needs-shipping') {
              userStatus = 'Đang xử lý';
            }

            userOrders[userOrderIndex].status = userStatus;
            localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(userOrders));

            // Trigger storage event for user orders
            window.dispatchEvent(new StorageEvent('storage', {
              key: USER_ORDERS_KEY,
              newValue: JSON.stringify(userOrders),
              url: window.location.href
            }));
          }
        } catch (error) {
          console.error('Error syncing with user orders:', error);
        }

        return { success: true, data: mockOrders[index], message: 'Cập nhật trạng thái thành công!' };
      }
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Arrange shipping
  arrangeShipping: async (orderId, shippingData) => {
    await delay();
    try {
      mockOrders = getAdminOrders();
      const index = mockOrders.findIndex(o => o.id === parseInt(orderId));
      if (index !== -1) {
        mockOrders[index].status = 'sent';
        mockOrders[index].shippingInfo = shippingData;

        // Update product shipping info
        if (mockOrders[index].products) {
          mockOrders[index].products.forEach(p => {
            p.dueDate = 'Đang giao hàng';
            p.shippingService = shippingData.service || 'J&T Express';
          });
        }

        saveAdminOrders(mockOrders);

        // Sync with user orders
        try {
          const USER_ORDERS_KEY = 'anta_user_orders';
          const userOrders = JSON.parse(localStorage.getItem(USER_ORDERS_KEY) || '[]');
          const userOrderIndex = userOrders.findIndex(uo =>
            uo.orderNumber === mockOrders[index].orderNumber ||
            uo.id === mockOrders[index].orderNumber ||
            uo.orderNumber === mockOrders[index].id
          );

          if (userOrderIndex !== -1) {
            userOrders[userOrderIndex].status = 'Đang giao';
            localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(userOrders));
          }
        } catch (error) {
          console.error('Error syncing with user orders:', error);
        }

        return { success: true, data: mockOrders[index], message: 'Sắp xếp giao hàng thành công!' };
      }
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Messages Service
export const adminMessageService = {
  // Get all messages
  getMessages: async (filters = {}) => {
    await delay();
    try {
      let filtered = [...mockMessages];

      if (filters.unreadOnly) {
        filtered = filtered.filter(m => !m.read);
      }

      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get single message
  getMessage: async (id) => {
    await delay();
    const message = mockMessages.find(m => m.id === parseInt(id));
    if (message) {
      return { success: true, data: message };
    }
    return { success: false, error: 'Không tìm thấy tin nhắn' };
  },

  // Mark as read
  markAsRead: async (id) => {
    await delay();
    try {
      const index = mockMessages.findIndex(m => m.id === parseInt(id));
      if (index !== -1) {
        mockMessages[index].read = true;
        return { success: true, data: mockMessages[index] };
      }
      return { success: false, error: 'Không tìm thấy tin nhắn' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reply to message
  replyToMessage: async (id, replyText) => {
    await delay();
    try {
      const index = mockMessages.findIndex(m => m.id === parseInt(id));
      if (index !== -1) {
        const reply = {
          id: mockMessages[index].replies.length + 1,
          sender: 'admin',
          message: replyText,
          time: 'Vừa xong'
        };
        mockMessages[index].replies.push(reply);
        mockMessages[index].read = true;
        return { success: true, data: mockMessages[index], message: 'Gửi phản hồi thành công!' };
      }
      return { success: false, error: 'Không tìm thấy tin nhắn' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Notifications Service
export const adminNotificationService = {
  // Get all notifications
  getNotifications: async (filters = {}) => {
    await delay();
    try {
      let filtered = [...mockNotifications];

      if (filters.unreadOnly) {
        filtered = filtered.filter(n => !n.read);
      }

      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark as read
  markAsRead: async (id) => {
    await delay();
    try {
      const index = mockNotifications.findIndex(n => n.id === parseInt(id));
      if (index !== -1) {
        mockNotifications[index].read = true;
        return { success: true, data: mockNotifications[index] };
      }
      return { success: false, error: 'Không tìm thấy thông báo' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    await delay();
    try {
      mockNotifications.forEach(n => n.read = true);
      return { success: true, message: 'Đã đánh dấu tất cả thông báo là đã đọc' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Settings Service
export const adminSettingsService = {
  // Get settings
  getSettings: async () => {
    await delay();
    return { success: true, data: mockSettings };
  },

  // Update settings
  updateSettings: async (settingsData) => {
    await delay();
    try {
      mockSettings = { ...mockSettings, ...settingsData };
      return { success: true, data: mockSettings, message: 'Lưu cài đặt thành công!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Dashboard Stats Service
export const adminStatsService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    await delay();
    try {
      const stats = {
        totalProducts: mockProducts.length,
        totalOrders: mockOrders.length,
        newOrders: mockOrders.filter(o => o.status === 'needs-shipping').length,
        completedOrders: mockOrders.filter(o => o.status === 'completed').length,
        totalRevenue: mockOrders.reduce((sum, o) => sum + o.total, 0),
        totalCustomers: new Set(mockOrders.map(o => o.customer)).size,
        unreadMessages: mockMessages.filter(m => !m.read).length,
        unreadNotifications: mockNotifications.filter(n => !n.read).length,
        lowStockProducts: mockProducts.filter(p => p.quantity < 20).length
      };
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default {
  products: adminProductService,
  orders: adminOrderService,
  messages: adminMessageService,
  notifications: adminNotificationService,
  settings: adminSettingsService,
  stats: adminStatsService
};
