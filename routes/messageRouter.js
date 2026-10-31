import express from "express";
import authUserMiddleware from "../middleware/authUserMiddleware.js";
import { getMessages, sendMessage, sendGuestMessage } from "../controllers/messageController.js";
import { authenticatedRateLimiter } from "../middleware/authenticatedRateLimiter.js";
import loadUserMiddleware from "../middleware/loadUserMiddleware.js";
import tokenUsageMiddleware from "../middleware/tokenUsageMiddleware.js";
import guestRateLimiter from "../middleware/guestRateLimiter.js";
import { getAvailableModels, getDefaultModel } from "../config/modelOptions.js";

const messageRouter = express.Router();

// Public routes must be registered before authentication middleware.
messageRouter.get("/models", (req, res) => {
    res.status(200).json({
        models: getAvailableModels(),
        defaultModel: getDefaultModel(),
    });
});
messageRouter.post("/guest", guestRateLimiter, sendGuestMessage);

// Saved chats below this point require a valid login cookie.
messageRouter.use(authUserMiddleware);
messageRouter.use(authenticatedRateLimiter);
messageRouter.use(loadUserMiddleware);

messageRouter.post("/", tokenUsageMiddleware, sendMessage);
messageRouter.get("/:chatId", getMessages);
messageRouter.post("/:chatId", tokenUsageMiddleware, sendMessage);

export default messageRouter;
