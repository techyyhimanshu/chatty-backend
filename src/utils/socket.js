import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["https://chatty-frontend-six.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }
})
const userSocketMap = {}

export function getRecieverSocketId(receiverId) {
    // console.log("userSocketMap", userSocketMap)
    return userSocketMap[receiverId]
}
io.on("connection", (socket) => {
    const LoggedInUserID = socket.handshake.query.userId
    console.log(`LoggedInUserID: ${LoggedInUserID}, socketId: ${socket.id}`)
    if (LoggedInUserID) {
        userSocketMap[LoggedInUserID] = socket.id
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }
    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id)
        delete userSocketMap[LoggedInUserID]
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})
export { io, server, app }