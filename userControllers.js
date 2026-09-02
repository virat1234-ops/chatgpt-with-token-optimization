import express from "express"
import mongoose from "mongoose";
import User from "../model/userSchema.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Chat from "../model/chatschema.js";
import Message from "../model/messageschema.js";
import authUserMiddleware from "../middleware/authUserMiddleware.js";
import { signupSchema, loginSchema } from "../validators/userValidators.js";
//login //logout //signup //profile
const createToken = (id, email) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT Secret key is missing");
    }
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
}
const cookiesOption = {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000
}
export const signup = async (req, res) => {
    try {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }
        const { name, age, email, password } = result.data;
        const ifalreadyexist = await (User.findOne({ email }));
        if (ifalreadyexist != null) {
            res.status(400).json({
                message: "Email ID already exist"
            })
            return;
        }
        const hashPassword = await bcrypt.hash(password, 12)
        const userCreated = await User.create({
            name,
            age,
            email,
            password: hashPassword
        });
        //make a token 
        const token = createToken(userCreated._id, email);
        res.cookie("token", token, cookiesOption);
        res.status(201).json({
            message: "User created successfully",
            name,
            age,
            email
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server error"
        })
    }
}
export const login = async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }
        const { email, password } = result.data;
        const ifuserexist = await (User.findOne({ email }));
        if (ifuserexist == null) {
            return res.status(404).json({
                message: "some fields are wrong"
            })

        }
        const isMatch = await bcrypt.compare(password, ifuserexist.password);
        if (isMatch == false) {
            return res.status(404).json({
                message: "some fields are wrong"
            })
        }
        const token = createToken(ifuserexist._id, ifuserexist.email);
        res.cookie("token", token, cookiesOption);
        res.status(201).json({
            message: "User login successfully",
            name: ifuserexist.name,
            age: ifuserexist.age,
            email: ifuserexist.email,
            usage: ifuserexist.usage
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server error"
        })
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
        });
        return res.status(200).json({
            message: "User Logged Out successfully"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server error"
        })
    }
}
export const profile = async (req, res) => {
    try {

        return res.status(200).json({
            name: req.user.name,
            age: req.user.age,
            usage: req.user.usage,
            email: req.user.email
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};
export const deleteUser = async (req, res) => {
    try {
        // 1. Find all chats belonging to the logged-in user
        const allchat = await Chat
            .find({ userId: req.user._id })
            .select("_id");

        // 2. Extract all chat IDs
        const chatIds = allchat.map((chat) => chat._id);

        // 3. Delete all messages belonging to those chats
        await Message.deleteMany({
            chatId: { $in: chatIds }
        });

        // 4. Delete all chats belonging to the user
        await Chat.deleteMany({
            userId: req.user._id
        });

        // 5. Delete the user
        await User.deleteOne({
            _id: req.user._id
        });

        // 6. Clear authentication cookie
        res.clearCookie("token");

        return res.status(200).json({
            message: "User and all associated data deleted successfully"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};