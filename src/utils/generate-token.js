import jwt from "jsonwebtoken"

const generateToken = (userId, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set the cookie
    res.cookie("jwt", token, {
        path: "/",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in ms
        httpOnly: true,  // Cookie cannot be accessed via JavaScript
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Use 'None' for cross-origin only in production
        secure: process.env.NODE_ENV === 'production', // Only use 'secure' in production (i.e., HTTPS)
    });

    return token;
};

export { generateToken };
