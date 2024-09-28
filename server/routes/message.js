import express from "express";
const router = express.Router();
import {
  getAllMessages,
} from "../controllers/messages.js";

router.get(`/user/:userId/:adminId`, getAllMessages);

export default router;
