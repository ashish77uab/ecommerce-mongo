import axios from "axios";
import { io } from "socket.io-client";
const devEnv = process.env.NODE_ENV !== "production";

const { REACT_APP_DEV_API, REACT_APP_PROD_API } = process.env;
const baseURL = `${devEnv ? REACT_APP_DEV_API : REACT_APP_PROD_API}`
export const socketConnect = (namespace) => {
  return io(`${baseURL}${namespace}`)
}
const API = axios.create({
  baseURL: baseURL ,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("ashishToken")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("ashishToken")}`;
  }
  return req;
});
// Banners
export const getBanners = () => API.get("banners");
export const updateBanner = (id, formData) =>
  API.put(`banners/${id}`, formData);
export const addBanner = (formData) => API.post("banners", formData);
export const deleteBannerImage = (id, formData) =>
  API.put(`banners/delete-banner-image/${id}`, formData);
// Category API
export const getCategories = () => API.get("categories");
export const addCategory = (formData) => API.post("categories", formData);
export const deleteCategory = (id) => API.delete(`categories/${id}`);
export const updateCategory = (id, formData) =>
  API.put(`categories/${id}`, formData);

// wishlist
export const addToWishList = (formData) => API.post("wishlist/add", formData);
export const getWishlistItem = () => API.get("wishlist");
export const removeWishlistItem = (id) => API.delete(`wishlist/${id}`);

// orders
export const removeCartItem = (id) => API.delete(`orders/remove-item/${id}`);
export const updateOrderStatus = (data) => API.put(`orders`, data);
export const cancelOrder = (data) => API.put(`orders/cancel-order`, data);
// admin
export const getAllOrderList = (data) => API.get(`orders/admin/all?page=${data?.page}&limit=${data?.limit}`);


// Products
export const getProducts = (data) => API.get(`products?min=${data?.min || ''}&max=${data?.max || ''}&category=${data?.category || []}&sort=${data?.sort || ''}`);
export const getBrands = () => API.get("products/brands");
export const addProduct = (formData) => API.post("products", formData);
export const deleteProduct = (id) => API.delete(`products/${id}`);
export const updateProduct = (id, formData) =>
  API.put(`products/${id}`, formData);
export const deleteProductImage = (id, formData) =>
  API.put(`products/delete-product-image/${id}`, formData);
export const addProductReview = ( formData) =>
  API.post(`products/add-product-review`, formData);
export const editProductReview = (id, formData) =>
  API.put(`products/edit-product-review/${id}`, formData);

export const addToCart = (formData) => API.post("orders/add-to-cart", formData);
export const getCartItems = () => API.get("orders/cart-items");
export const placeOrder = (formData) => API.post("orders", formData);
export const getAllUserOrders = () => API.get(`orders/user-orders`);

// Sub Category
export const addSubCategory = (formData) =>
  API.post("sub-categories/add", formData);
export const deleteSubCategory = (id) => API.delete(`sub-categories/${id}`);
export const updateSubCategory = (id, formData) =>
  API.put(`sub-categories/${id}`, formData);
export const getAllSubCategories = (formData) =>
  API.post("sub-categories", formData);
export const getSubCategories = (formData) =>
  API.get("sub-categories", formData);

// Product API
export const getFeaturedProducts = () => API.get("products/featured");
export const getAllProducts = () => API.get("products");
export const getSingleProduct = (id) => API.get(`products/${id}`);

// User
export const login = (formData) => API.post(`auth/login`, formData);
export const register = (formData) => API.post(`auth/register`, formData);
export const forgotRequest = (formData) =>
  API.post(`auth/requestResetPassword`, formData);
export const resetPassword = (formData) =>
  API.post(`auth/resetPassword`, formData);
export const getUser = () => API.get("auth/profile");
export const uploadProfileImage = (id, formData) =>
  API.post(`auth/profileImage/${id}`, formData);
export const uploadImage = (formData) => API.post("upload", formData);

export const getAllUsersList = (data) => API.get(`auth/all-users?page=${data?.page}&limit=${data?.limit}`);
export const getAllUserNotifications = (data) => API.get(`auth/notifications?skip=${data?.skip}&take=${data?.take}`);
export const deleteNotification = (notificationId) => API.delete(`auth/notifications/delete/${notificationId}`);
export const readNotification = (notificationId) => API.put(`auth/notifications/read/${notificationId}`);

// Vouchers
export const getAllVouchers = (data) => API.get(`voucher?page=${data?.page}&limit=${data?.limit}`);
export const createVoucher = (data) => API.post(`voucher/create`,data);
export const updateVoucher = (voucherId, data) => API.put(`voucher/update/${voucherId}`, data);
export const getVoucher = (voucherId) => API.get(`voucher/single/${voucherId}`);
export const deleteVoucher = (voucherId) => API.delete(`voucher/delete/${voucherId}`);
export const checkVoucherCode = (data) => API.post(`voucher/check`, data);
