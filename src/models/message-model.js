import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: "String"
    },
    image: {
        type: "String"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const Message = mongoose.model("Message", messageSchema)
export default Message