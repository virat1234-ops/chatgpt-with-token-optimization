import Chat from "../model/chatSchema.js";
import Message from "../model/messageSchema.js";
import { generateAIResponse } from "../service/openRouterService.js";
import { buildMessagesForAI, SYSTEM_PROMPT } from "../utils/chatContext.js";
import {
    addUserTokenUsage,
} from "../utils/userUsage.js";
import { addChatTokenUsage } from "../utils/tokenUsage.js";
import { updateSummaryIfNeeded } from "../utils/summaryService.js";
import { redisClient } from "../config/redis.js";
import { getDefaultModel, isAvailableModel, getAvailableModels } from "../config/modelOptions.js";
// Guest messages are sent to the model but are never saved to MongoDB.
export const sendGuestMessage = async (req, res) => {
    try {
        const { content, model, history } = req.body;

        if (typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({ message: "Message content is required." });
        }
        if (content.length > 12000) {
            return res.status(400).json({ message: "Please keep each message under 12,000 characters." });
        }

        const selectedModel = model || getDefaultModel();
        if (!isAvailableModel(selectedModel)) {
            return res.status(400).json({
                message: "That model is not available in this app. Please choose another model.",
                models: getAvailableModels(),
            });
        }

        const safeHistory = Array.isArray(history)
            ? history.slice(-20).filter((item) =>
                item &&
                (item.role === "user" || item.role === "assistant") &&
                typeof item.content === "string" &&
                item.content.trim() !== "" &&
                item.content.length <= 12000
            ).map((item) => ({ role: item.role, content: item.content }))
            : [];

        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...safeHistory,
            { role: "user", content: content.trim() },
        ];

        const { aiReply, usage } = await generateAIResponse({
            model: selectedModel,
            messages,
        });

        // Important: no Chat.create(), Message.create(), or MongoDB write occurs here.
        return res.status(200).json({
            message: "Guest message answered successfully",
            reply: aiReply,
            model: selectedModel,
            usage,
        });
    } catch (err) {
        console.error("sendGuestMessage error:", err.message);
        return res.status(502).json({
            message: "The selected model could not answer this message. Try again or choose another model.",
        });
    }
};

//get message
//send message

export const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { content, model } = req.body;

        if (typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({
                message: "Message content is required",
            });
        }
        if (content.length > 12000) {
            return res.status(400).json({
                message: "Please keep each message under 12,000 characters.",
            });
        }
        let chat;
        const selectedModel = model || getDefaultModel();

        if (!chatId && model && !isAvailableModel(model)) {
            return res.status(400).json({
                message: "That model is not in the model list. Please choose a model from the dropdown.",
            });
        }

        if (chatId) {
            chat = await Chat.findOne({
                _id: chatId,
                userId: req.user._id,
            });

            if (!chat) {
                return res.status(404).json({
                    message: "Chat not found",
                });
            }

            // Allow the current model for old chats, even if it was later removed
            // from the dropdown, and allow switches to supported models.
            if (model && model !== chat.model && !isAvailableModel(model)) {
                return res.status(400).json({
                    message: "Please choose a model from the dropdown.",
                });
            }
            if (model && chat.model !== model) {
                chat.model = model;
                await chat.save();
            }
            if (!chat.model) {
                chat.model = selectedModel;
                await chat.save();
            }
        } else {
            chat = await Chat.create({
                userId: req.user._id,
                model: selectedModel,
                topic: content.trim().slice(0, 40),
            });
        }

        const oldMessages = await Message.find({
            chatId: chat._id,
        })
            .sort({ createdAt: 1 })
            .skip(chat.summarizedTillMessageNumber);

        const messagesForAI = buildMessagesForAI({
            chat,
            oldMessages,
            currentMessage: content.trim(),
        });

        const { aiReply, usage } = await generateAIResponse({
            model: chat.model,
            messages: messagesForAI,
        });

        const userMessage = await Message.create({
            chatId: chat._id,
            role: "user",
            content: content.trim(),
            userId: req.user._id
        });

        const assistantMessage = await Message.create({
            chatId: chat._id,
            role: "assistant",
            content: aiReply,
            userId: req.user._id,
            usage,
        });

        chat.messageCount += 2;

        if (chat.topic === "New Chat") {
            chat.topic = content.trim().slice(0, 40);
        }

        await addChatTokenUsage(chat, usage);
        await addUserTokenUsage(req.user, usage.totalTokens);
        const tokenUsed = await redisClient.incrBy(
            req.tokenUsageKey,
            usage.totalTokens
        );

        if (tokenUsed === usage.totalTokens) {
            await redisClient.expire(
                req.tokenUsageKey,
                Number(process.env.TOKEN_WINDOW_SECONDS)
            );
        }
        updateSummaryIfNeeded(chat._id).catch((err) => {
            console.log("Summary update failed:", err.message);
        });
        return res.status(201).json({
            message: "Message sent successfully",
            chatId: chat._id,
            reply: aiReply,
            usage,
            tokenUsed,
            tokenLimit: Number(process.env.TOKEN_LIMIT),
            userMessage,
            assistantMessage
        });
    } catch (err) {
        console.log("sendMessage error:", err.message);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findOne({
            _id: chatId,
            userId: req.user._id,
        });

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        const messages = await Message.find({
            chatId: chat._id,
        }).sort({ createdAt: 1 });

        res.status(200).json({
            message: "Messages fetched successfully",
            chat: {
                id: chat._id,
                topic: chat.topic,
                model: chat.model,
                messageCount: chat.messageCount,
            },
            messages,
        });
    } catch (err) {
        console.log("getMessages error:", err.message);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

// 6a905ad8eeec6e7a86a845a8

