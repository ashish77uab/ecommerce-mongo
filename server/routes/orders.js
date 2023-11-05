import express from "express";
import {
  addToCart,
  createOrder,
  getAllCartItem,
  getAllOrders,
  getAllUserOrders,
  getOrdersCount,
  getTotalSales,
  updateOrder,
} from "../controllers/orders.js";
import { authenticateJWT } from "../middleware/auth.js";
const router = express.Router();
router.post(`/add-to-cart`, authenticateJWT, addToCart);
router.get(`/cart-items`, authenticateJWT, getAllCartItem);
router.get(`/all`, authenticateJWT, getAllOrders);
router.get("/totalsales", authenticateJWT, getTotalSales);
router.get(`/count`, authenticateJWT, getOrdersCount);
router.get(`/user-orders/:userid`, authenticateJWT, getAllUserOrders);
router.post("/", authenticateJWT, createOrder);
router.put("/:id", authenticateJWT, updateOrder);

export default router;
