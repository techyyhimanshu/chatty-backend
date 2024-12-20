import express from "express";
import { protectedRoute } from "../middlewares/auth-middleware.js";
import { getMessages, getUnreadMessages, getUsersForSideBar, sendMessage, updateMessageStatus } from "../controllers/message-controller.js";
const router = express.Router()

router.get("/user/:id", protectedRoute, getMessages)
router.post("/send/:id", protectedRoute, sendMessage)
router.get("/unread", protectedRoute, getUnreadMessages)
router.patch("/update-status/:id", protectedRoute, updateMessageStatus)

export default router