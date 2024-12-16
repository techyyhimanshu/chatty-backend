import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const { jwt: token } = req.cookies
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized- No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized- Invalid token' });
        }
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized- User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}