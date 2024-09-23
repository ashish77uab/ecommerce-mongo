import express from "express";
const router = express.Router();
import {
  signup,
  signin,
  googleSignIn,
  getUser,
  uploadProfileImage,
  resetPasswordRequestController,
  resetPasswordController,
  getUsers,
  getNotifications,
  deleteNotifications,
  readNotifications
} from "../controllers/users.js";
import { authenticateJWT } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

router.post("/register", signup);
router.post("/login", signin);
router.post("/requestResetPassword", resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);
router.post("/googleSignIn", googleSignIn);
router.get("/profile", authenticateJWT, getUser);
router.get("/all-users", authenticateJWT, getUsers);
router.get("/notifications", authenticateJWT, getNotifications);
router.delete("/notifications/delete/:id", authenticateJWT, deleteNotifications);
router.put("/notifications/read/:id", authenticateJWT, readNotifications);
router.post("/profileImage/:id", authenticateJWT, upload.single('file'), uploadProfileImage);

export default router;
