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
                { senderId: loggedInId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: loggedInId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time (optional)

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const getUnreadMessages = async (req, res) => {
    try {
        const loggedInId = req.user?._id; // Logged-in user's ID

        // Query messages involving the logged-in user and unread status
        const unreadMessages = await Message.find({
            receiverId: loggedInId, // Match receiver ID
            is_read: false,         // Match unread messages
        }).sort({ createdAt: 1 }); // Sort messages by creation time (optional)

        res.status(200).json({ success: true, data: unreadMessages });
    } catch (error) {
        console.error("Error fetching Unread messages:", error);
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
        console.log("receiverSocketId", receiverSocketId)
        if (receiverSocketId) {
            console.log(newMessage)
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json({ success: true, data: newMessage })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}
const updateMessageStatus = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const authUserId = req.user._id;

        // Validate user IDs
        if (!selectedUserId || !authUserId) {
            return res.status(400).json({ success: false, message: "Invalid user IDs" });
        }

        // Update message status
        const updatedMessage = await Message.updateMany(
            {
                senderId: selectedUserId,
                receiverId: authUserId,
                is_read: false
            },
            { $set: { is_read: true } }
        );

        if (updatedMessage.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "No unread messages found" });
        }
        console.log("authUserId", authUserId)
        const authUserSocketId = getRecieverSocketId(authUserId)
        console.log("authUserSocketId", authUserSocketId)
        if (authUserSocketId) {
            console.log("receiverSocketId", authUserSocketId)
            console.log(updatedMessage.modifiedCount)
            io.to(authUserSocketId).emit("updateMessageStatus", updatedMessage.modifiedCount)
        }

        res.status(200).json({ success: true, message: "Message status updated successfully" });
    } catch (error) {
        console.error("Error updating message status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export {
    getUsersForSideBar,
    getMessages,
    sendMessage,
    getUnreadMessages,
    updateMessageStatus
}