import express from "express"
import { createChat,getRecentChat,getSingleChat,deleteChat } from "../controllers/chatController.js"
import authUserMiddleware from "../middleware/authUserMiddleware.js";
import { authenticatedRateLimiter } from "../middleware/authenticatedRateLimiter.js";
import loadUserMiddleware from "../middleware/loadUserMiddleware.js";
//get recent chat (top 20) //getsingle chat ,create chat,delete chat  

const chatRouter=express.Router();
chatRouter.use(authUserMiddleware);//middleware
chatRouter.use(authenticatedRateLimiter);
chatRouter.use(loadUserMiddleware)
chatRouter.post("/createChat",createChat);
chatRouter.get("/getRecentChat",getRecentChat);
chatRouter.get("/:chatId",getSingleChat);
chatRouter.delete("/:chatId",deleteChat);


export default chatRouter;