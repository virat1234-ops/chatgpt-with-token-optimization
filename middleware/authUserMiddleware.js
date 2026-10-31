import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";

const authUserMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Please log in to continue." });
        }

        const blockedToken = await redisClient.get(`blocklist:${token}`);
        if (blockedToken) {
            return res.status(401).json({ message: "Please log in again." });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.id;
        req.token = token;
        req.tokenPayload = payload;
        return next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Your session expired. Please log in again." });
        }
        console.error("Authentication error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default authUserMiddleware;
