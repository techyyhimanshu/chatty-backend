import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://chatty-frontend-six.vercel.app",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }
})
const userSocketMap = {}

export function getRecieverSocketId(receiverId) {
    console.log("userSocketMap", userSocketMap)
    return userSocketMap[receiverId]
}
io.on("connection", (socket) => {
    console.log("a user connected", socket.id)
    const userId = socket.handshake.query.userId
    console.log("Userid", userId)
    if (userId) {
        userSocketMap[userId] = socket.id
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }
    //Send online users
    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})
export { io, server, app }