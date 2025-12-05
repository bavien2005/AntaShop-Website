//src/services/api.js
import axios from "axios";
import { API_ENDPOINTS, STORAGE_KEYS } from "../constants/index";

// ------------------- BASE URLs -------------------
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

const PRODUCT_BASE_URL =
  import.meta.env.VITE_PRODUCT_SERVICE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

const TOKEN_KEY = STORAGE_KEYS.TOKEN;

// ------------------- MAIN API (Gateway) -------------------
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ------------------- PRODUCT API (Direct product-service) -------------------
export const productApi = axios.create({
  baseURL: PRODUCT_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

productApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ------------------- AUTH SERVICE -------------------
export const authService = {
  login: async (credentials) => {
    const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return res.data;
  },

  register: async (data) => {
    const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return res.data;
  },

  refreshToken: async (refreshToken) => {
    const payload =
      typeof refreshToken === "string"
        ? { refreshToken }
        : refreshToken || {};

    const res = await api.post(API_ENDPOINTS.AUTH.REFRESH, payload);
    return res.data;
  }
};

// ------------------- PRODUCT SERVICE (User-facing via gateway) -------------------
export const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
    return res.data;
  },

  getProduct: async (id) => {
    const url = API_ENDPOINTS.PRODUCTS.DETAIL.replace(":id", id);
    const res = await api.get(url);
    return res.data;
  },

  searchProducts: async (query) => {
    const res = await api.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: { q: query }
    });
    return res.data;
  }
};

// ------------------- CART SERVICE -------------------
export const cartService = {
  addToCart: async (productId, quantity = 1) => {
    const res = await api.post(API_ENDPOINTS.CART.ADD, { productId, quantity });
    return res.data;
  },

  removeFromCart: async (productId) => {
    const res = await api.delete(API_ENDPOINTS.CART.REMOVE, {
      data: { productId }
    });
    return res.data;
  },

  updateCartItem: async (productId, quantity) => {
    const res = await api.put(API_ENDPOINTS.CART.UPDATE, {
      productId,
      quantity
    });
    return res.data;
  }
};

// ------------------- USER SERVICE -------------------
export const userService = {
  getProfile: async () => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    return {
      fullName: user?.username || "",
      email: user?.email || "",
      phone: "",
      birthday: "",
      gender: ""
    };
  },

  updateProfile: async (data) => {
    return data;
  },

  changePassword: async () => {
    return { message: "Đổi mật khẩu thành công (mock)" };
  },

  getAddresses: async () => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    if (!user) return [];

    const res = await api.get(`/api/address/allUserAddress/${user.id}`);
    const d = res.data;

    if (Array.isArray(d)) return d;
    if (typeof d === "object") {
      return Object.values(d).find((v) => Array.isArray(v)) || [];
    }
    return [];
  },

  addAddress: async (data) => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    const payload = {
      detailedAddress: data.detailedAddress || data.address,
      country: data.country || "Vietnam",
      phoneNumber: data.phoneNumber || data.phone,
      recipientName: data.recipientName,
      postalCode: data.postalCode || "",
      isDefault: data.isDefault || false
    };

    const res = await api.post(`/api/address/add/${user.id}`, payload);
    return Object.keys(res.data)[0];
  },

  updateAddress: async (id, data) => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    const payload = {
      detailedAddress: data.detailedAddress || data.address,
      country: data.country || "Vietnam",
      phoneNumber: data.phoneNumber || data.phone,
      recipientName: data.recipientName,
      postalCode: data.postalCode || "",
      isDefault: data.isDefault || false
    };

    const res = await api.put(`/api/address/update/addressId/${id}/userId/${user.id}`, payload);
    return Object.keys(res.data)[0];
  },

  deleteAddress: async (id) => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    const res = await api.delete(`/api/address/delete/addressId/${id}/userId/${user.id}`);
    return res.data;
  },

  setDefaultAddress: async (id) => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    const res = await api.put(`/api/address/setDefault/${id}/user/${user.id}`);
    return res.data;
  }
};

// ------------------- MOCK ORDER SERVICE -------------------
export const orderService = {
  getOrders: async () => [],
  getOrder: async () => null,
  cancelOrder: async () => ({ message: "Canceled (mock)" })
};

// ------------------- MOCK WISHLIST SERVICE -------------------
export const wishlistService = {
  getWishlist: async () => [],
  addToWishlist: async () => ({ success: true }),
  removeFromWishlist: async () => ({ success: true })
};

export default api;
