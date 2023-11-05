import express from "express";
import {
  addToWishList,
  removeFromWishList,
  getAllWishistItem,
} from "../controllers/wishlist.js";
import { authenticateJWT } from "../middleware/auth.js";
const router = express.Router();
router.get(`/`, authenticateJWT, getAllWishistItem);
router.post(`/add`, authenticateJWT, addToWishList);
router.delete("/:id", authenticateJWT, removeFromWishList);

export default router;
