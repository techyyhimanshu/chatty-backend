import User from "../models/user-model.js"
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generate-token.js';
import cloudinary from "../utils/cloudinary.js"

const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body
        if (!fullname || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password length must be greater than 6 " })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword
        })
        if (newUser) {
            generateToken(newUser._id, res)
            return res.status(201).json({
                status: true, data: {
                    id: newUser._id,
                    email
                }
            })
        }
        return res.status(400).json({ status: false, message: "Invalid user data" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credentials!" })
        }
        const isPasswordCorrecct = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrecct) {
            return res.status(400).json({ success: false, message: "Invalid Credentials!" })
        }
        generateToken(user._id, res)
        return res.status(200).json({
            success: true, data: {
                id: user._id,
                email
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}
const logout = ((req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({ success: true, message: "Logout successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
})
const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id
        if (!profilePic) {
            return res.status(400).json({
                success: false, message: "Please provide profile picture"
            })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, { new: true })
        return res.status(200).json({ stats: true, data: updatedUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}
const checkAuth = (req, res) => {
    try {
        console.log("called")
        return res.status(200).json(req.user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}
export {
    signup,
    login,
    logout,
    updateProfile,
    checkAuth
}