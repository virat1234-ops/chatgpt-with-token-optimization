import dotenv from "dotenv/config";
import express from "express"
import connectDB from "./config/database.js";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chatRouter.js";
import messageRouter from "./routes/messageRouter.js";
// dotenv.config();
const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/chat",chatRouter);
app.use("/message", messageRouter);
const startServer = async () => {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log("Server has started Listening at port 3000");
        })
    }
    catch (err) {
        console.log("Database connection failed");
        console.log(err);
    }
}
startServer();
