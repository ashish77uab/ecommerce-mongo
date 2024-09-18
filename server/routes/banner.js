import express from "express";
const router = express.Router();
import upload from "../middleware/upload.js";
import {
  getAllBanner,
  createBanner,
  updateBanner,
  deleteBannerImage,
} from "../controllers/banner.js";

router.get(`/`, getAllBanner);
router.post(`/`, upload.array("images", 10), createBanner);
router.put("/:id",upload.array("images", 10), updateBanner);
router.put("/delete-banner-image/:id", deleteBannerImage);

export default router;
