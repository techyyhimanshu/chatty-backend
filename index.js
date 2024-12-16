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
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json({
    limit: "50mb"
}))
app.use("/", (req, res) => {
    return res.status(200).send("hello from chatty server")
})
app.use("/api", routes)
const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectToDB()
})