import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const productService = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  search: (q) => api.get(`/api/products/search?q=${q}`),
  getSellerProducts: () => api.get('/api/products/seller'),
  getAllAdmin: () => api.get('/api/products/admin'),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/api/categories'),
  getAllFlat: () => api.get('/api/categories/flat'),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export const cartService = {
  get: () => api.get('/api/cart'),
  add: (data) => api.post('/api/cart', data),
  updateItem: (itemId, quantite) => api.put(`/api/cart/${itemId}?quantite=${quantite}`),
  removeItem: (itemId) => api.delete(`/api/cart/${itemId}`),
  clear: () => api.delete('/api/cart'),
};

export const orderService = {
  getMyOrders: () => api.get('/api/orders'),
  getAllOrders: () => api.get('/api/orders/all'),
  getById: (id) => api.get(`/api/orders/${id}`),
  placeOrder: (data) => api.post('/api/orders', data),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status?status=${status}`),
};

export const reviewService = {
  getByProduct: (productId) => api.get(`/api/reviews/product/${productId}`),
  getAll: () => api.get('/api/reviews/all'),
  create: (data) => api.post('/api/reviews', data),
  approve: (id) => api.put(`/api/reviews/${id}/approve`),
  delete: (id) => api.delete(`/api/reviews/${id}`),
};

export const couponService = {
  getAll: () => api.get('/api/coupons'),
  validate: (code) => api.get(`/api/coupons/validate?code=${code}`),
  create: (data) => api.post('/api/coupons', data),
  delete: (id) => api.delete(`/api/coupons/${id}`),
};

export const addressService = {
  getAll: () => api.get('/api/addresses'),
  create: (data) => api.post('/api/addresses', data),
  update: (id, data) => api.put(`/api/addresses/${id}`, data),
  delete: (id) => api.delete(`/api/addresses/${id}`),
};

export const userService = {
  getProfile: () => api.get('/api/users/me'),
  updateProfile: (data) => api.put('/api/users/me', data),
  getAll: () => api.get('/api/users'),
  toggleStatus: (id) => api.put(`/api/users/${id}/toggle`),
  getDashboard: () => api.get('/api/users/dashboard'),
};
