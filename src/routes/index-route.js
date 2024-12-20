import express from "express";
import authRoute from "./auth-routes.js";
import messageRoute from "./message-route.js";
import userRoute from "./user-route.js";

const router = express.Router()
router.use("/auth", authRoute)
router.use("/messages", messageRoute)
router.use("/users", userRoute)

export default router