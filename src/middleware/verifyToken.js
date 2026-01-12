import userSchema from "../models/userSchema.js";
import dotenv from "dotenv/config";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => {
  try {
    const token = req.query.token 

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing"
      })
    }

    jwt.verify(token, process.env.secretKey, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token"
        })
      }

      const user = await userSchema.findById(decoded.id)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        })
      }
      if (user.isVerified) {
        return res.status(200).json({
          success: true,
          message: "Email already verified"
        });
      }
      user.isVerified = true
      user.token = null
      await user.save()

      return res.redirect("http://10.162.155.222:5500/frontend/index.html");
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
