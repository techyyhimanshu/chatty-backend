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
    is_read: {
        type: "Boolean",
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const Message = mongoose.model("Message", messageSchema)
export default Message