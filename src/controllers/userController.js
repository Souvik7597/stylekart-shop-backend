import userSchema from "../models/userSchema.js";
import dotenv from "dotenv/config"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import sessionSchema from "../models/sessionSchema.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const exists = await userSchema.findOne({ email })
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await userSchema.create({ name, email, password: hashedPassword })
        const token = jwt.sign({ id: newUser._id }, process.env.secretKey, {
            expiresIn: "1h"
        })
        newUser.token = token
        await newUser.save()
        verifyEmail(token, email)
        if (newUser) {
            return res.status(201).json({
                success: true,
                message: "User Registered Successfully",
                newUser
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email first"
            });
        }
        await sessionSchema.findOneAndDelete({ userId: user._id })
        await sessionSchema.create({ userId: user._id })
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.secretKey,
            { expiresIn: "10d" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.secretKey,
            { expiresIn: "30d" }
        );

        user.isLoggedIn = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {

    try {
        const existing = await sessionSchema.findOne({ userId: req.userId });
        const user = await userSchema.findById(req.userId )

        if (existing) {
            await sessionSchema.findOneAndDelete({ userId: req.userId });
            user.isLoggedIn = false
            await user.save()
            return res.status(200).json({
                success: true,
                message: "Session successfully ended",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User had no session",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const profileController = async (req, res) => {
    try {
        const user = await userSchema.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const allUserController = async (req, res) => {
    try {
        const users = await userSchema.find().select("-password");
        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};