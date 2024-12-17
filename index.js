import express from "express";
import routes from "./src/routes/index-route.js";
import dotenv from 'dotenv';
import connectToDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { io, server, app } from "./src/utils/socket.js"
const router = express.Router()
import cors from "cors";

dotenv.config()
app.use(cors({
    origin: ["https://chatty-frontend-six.vercel.app", "http://localhost:5173"],// Allow requests from these domains
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json({
    limit: "50mb"
}))
app.use("/api", routes)
const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectToDB()
})