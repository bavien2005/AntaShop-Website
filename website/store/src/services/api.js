import axios from 'axios';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { getErrorMessage } from '../utils';

// Create axios instance
const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and let AuthContext handle redirect
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // Dispatch custom event for AuthContext to handle navigation
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

// Product services
export const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getProduct: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.DETAIL.replace(':id', id));
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  searchProducts: async (query) => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

// Cart services
export const cartService = {
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post(API_ENDPOINTS.CART.ADD, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.CART.REMOVE, {
        data: { productId }
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put(API_ENDPOINTS.CART.UPDATE, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

// Import mock user services
import mockUserService from './userService';

// User services - Using mock data
export const userService = {
  getProfile: async () => {
    try {
      return await mockUserService.profile.getProfile();
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi tải thông tin người dùng');
    }
  },

  updateProfile: async (userData) => {
    try {
      return await mockUserService.profile.updateProfile(userData);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi cập nhật thông tin');
    }
  },

  changePassword: async (passwordData) => {
    try {
      return await mockUserService.profile.changePassword(passwordData);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi đổi mật khẩu');
    }
  },

  getAddresses: async () => {
    try {
      return await mockUserService.addresses.getAddresses();
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi tải danh sách địa chỉ');
    }
  },

  addAddress: async (addressData) => {
    try {
      return await mockUserService.addresses.addAddress(addressData);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi thêm địa chỉ');
    }
  },

  updateAddress: async (id, addressData) => {
    try {
      return await mockUserService.addresses.updateAddress(id, addressData);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi cập nhật địa chỉ');
    }
  },

  deleteAddress: async (id) => {
    try {
      return await mockUserService.addresses.deleteAddress(id);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi xóa địa chỉ');
    }
  },

  setDefaultAddress: async (id) => {
    try {
      return await mockUserService.addresses.setDefaultAddress(id);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi đặt địa chỉ mặc định');
    }
  },
};

// Order services - Using mock data
export const orderService = {
  getOrders: async (params = {}) => {
    try {
      return await mockUserService.orders.getOrders(params);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi tải đơn hàng');
    }
  },

  getOrder: async (id) => {
    try {
      return await mockUserService.orders.getOrder(id);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi tải chi tiết đơn hàng');
    }
  },

  cancelOrder: async (id) => {
    try {
      return await mockUserService.orders.cancelOrder(id);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi hủy đơn hàng');
    }
  },
};

// Wishlist services - Using mock data
export const wishlistService = {
  getWishlist: async () => {
    try {
      return await mockUserService.wishlist.getWishlist();
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi tải danh sách yêu thích');
    }
  },

  addToWishlist: async (productId) => {
    try {
      return await mockUserService.wishlist.addToWishlist(productId);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi thêm vào danh sách yêu thích');
    }
  },

  removeFromWishlist: async (id) => {
    try {
      return await mockUserService.wishlist.removeFromWishlist(id);
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi xóa khỏi danh sách yêu thích');
    }
  },
};

export default api;
