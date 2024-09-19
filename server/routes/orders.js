import express from "express";
import {
  addToCart,
  createOrder,
  getAllCartItem,
  getAllOrders,
  getAllUserOrders,
  getOrdersCount,
  getTotalSales,
  removeCartItem,
  updateOrder,
  getAllOrdersAdmin,
  cancelOrder
} from "../controllers/orders.js";
import { authenticateJWT } from "../middleware/auth.js";
const router = express.Router();
router.post(`/add-to-cart`, authenticateJWT, addToCart);
router.delete(`/remove-item/:id`, authenticateJWT, removeCartItem);
router.get(`/cart-items`, authenticateJWT, getAllCartItem);
router.get(`/all`, authenticateJWT, getAllOrders);
router.get("/totalsales", authenticateJWT, getTotalSales);
router.get(`/count`, authenticateJWT, getOrdersCount);
router.get(`/user-orders`, authenticateJWT, getAllUserOrders);
router.post("/", authenticateJWT, createOrder);
router.put("/", authenticateJWT, updateOrder);
router.put("/cancel-order", authenticateJWT, cancelOrder);
router.get("/admin/all", authenticateJWT, getAllOrdersAdmin);

export default router;
