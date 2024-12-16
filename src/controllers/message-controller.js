import User from "../models/user-model.js"
import Message from "../models/message-model.js"
import cloudinary from "../utils/cloudinary.js"
import mongoose from "mongoose"
import { getRecieverSocketId, io } from "../utils/socket.js"


const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json({ success: true, data: filteredUsers })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; // ID of the user to chat with
        const loggedInId = req.user?._id; // Logged-in user's ID


        // Convert `userToChatId` to ObjectId
        const userToChatObjectId = new mongoose.Types.ObjectId(userToChatId);
        // Query messages involving the logged-in user and the other user
        const messages = await Message.find({
            $or: [
                { senderId: loggedInId, receiverId: userToChatObjectId },
                { senderId: userToChatObjectId, receiverId: loggedInId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time (optional)

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const sendMessage = async (req, res) => {
    try {
        const { text: message, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text: message,
            image: imageUrl
        }
        )
        const receiverSocketId = getRecieverSocketId(receiverId)
        if (receiverSocketId) {
            console.log("receiverSocketId", receiverSocketId)
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json({ success: true, data: newMessage })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}

export {
    getUsersForSideBar,
    getMessages,
    sendMessage
}