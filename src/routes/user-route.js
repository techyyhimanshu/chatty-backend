import express from "express";
import { protectedRoute } from "../middlewares/auth-middleware.js";
import { getUsersForSideBar } from "../controllers/message-controller.js";
const router = express.Router()

router.get("/sidebar", protectedRoute, getUsersForSideBar)


export default router