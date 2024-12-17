import jwt from "jsonwebtoken"

const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("jwt", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // ms
        httpOnly: true,
        sameSite: "None", // Allows cross-origin
        secure: true,
        partitioned: true
    })
    return token
}
export { generateToken }