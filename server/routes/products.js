import express from "express";
const router = express.Router();
import upload from "../middleware/upload.js";
import {
  createProduct,
  createReviewForProduct,
  deleteProduct,
  deleteProductImage,
  getAllProduct,
  getBrands,
  getFeaturedProduct,
  getProduct,
  getStats,
  updateProduct,
  editReviewForProduct
} from "../controllers/products.js";
import { authenticateJWT } from "../middleware/auth.js";

router.get(`/`, getAllProduct);
router.get(`/featured`, getFeaturedProduct);
router.get(`/stats`, getStats);
router.get(`/brands`, getBrands);
router.get(`/:id`, getProduct);
router.post("/add-product-review", authenticateJWT,createReviewForProduct);
router.put("/edit-product-review/:reviewId", authenticateJWT, editReviewForProduct);
router.post(`/`, upload.array("images", 10), createProduct);
router.put("/:id",upload.array("images", 10), updateProduct);
router.delete("/:id", deleteProduct);
router.put("/delete-product-image/:id", deleteProductImage);


export default router;
