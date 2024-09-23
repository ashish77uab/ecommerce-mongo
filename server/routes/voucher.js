import express from "express";
const router = express.Router();
import {
  createVoucher,
  updateVoucher,
  getAllVoucher,
  deleteVoucher,
  getVoucher,
  checkVoucherCode
} from "../controllers/voucher.js";
import { authenticateJWT } from "../middleware/auth.js";

router.get("/single/:voucherId", getVoucher);
router.get(`/`, getAllVoucher);
router.delete("/delete/:voucherId", deleteVoucher);
router.post("/create", createVoucher);
router.put("/update/:voucherId", updateVoucher);
router.post("/check", authenticateJWT, checkVoucherCode);


export default router;
