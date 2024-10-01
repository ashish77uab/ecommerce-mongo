import express from "express";
const router = express.Router();
import {
  getAllMessages,
  readMessage
} from "../controllers/messages.js";

router.get(`/user/:userId/:adminId`, getAllMessages);
router.get(`/read/:messageId`, readMessage);

export default router;
