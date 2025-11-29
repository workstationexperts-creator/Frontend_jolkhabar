// src/api/apiService.js
import api from './axiosInstance';

// --- AUTH ---
export const login = async (email, password) => {
  const { data } = await api.post('/auth/authenticate', { email, password });

  if (data.token) {
    localStorage.setItem("authToken", data.token);
    if (data.name) localStorage.setItem("username", data.name);
    if (data.role) localStorage.setItem("role", data.role);
  }

  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

// --- CATEGORY ---
export const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

export const getCategoryById = async (id) => {
  const { data } = await api.get(`/categories/${id}`);
  return data;
};

export const addCategory = async (categoryData) => {
  const { data } = await api.post('/categories', categoryData);
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await api.put(`/categories/${id}`, categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

// --- PRODUCTS ---
export const getProductsByCategory = async (categoryId) => {
  const { data } = await api.get(`/products?categoryId=${categoryId}`);
  return data;
};

export const getAllProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const addProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// --- CART ---
export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

export const addToCart = async (productId, quantity) => {
  const { data } = await api.post('/cart/add', null, {
    params: { productId, quantity },
  });
  return data;
};

export const updateItemQuantity = async (productId, quantity) => {
  const { data } = await api.put('/cart/update', null, {
    params: { productId, quantity },
  });
  return data;
};

export const removeItemFromCart = async (productId) => {
  const { data } = await api.delete('/cart/remove', { params: { productId } });
  return data;
};

// --- ORDERS ---
export const placeOrder = async (address) => {
  const { data } = await api.post('/orders/place', address);
  return data;
};

// --- SHIPROCKET ---
export const getShipments = async () => {
  const { data } = await api.get('/shiprocket/shipments');
  return data;
};
// --- ADMIN ORDERS ---
export const getAllOrders = async () => {
  const { data } = await api.get('/orders'); // Works with your @GetMapping
  return data;
};
export const getMyOrders = async () => {
  const { data } = await api.get('/orders/my');
  return data;
};
