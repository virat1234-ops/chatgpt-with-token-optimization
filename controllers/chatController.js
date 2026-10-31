import Chat from "../model/chatSchema.js"
import Message from "../model/messageSchema.js";
export const createChat=async(req,res)=>{
    try{
        const {model}=req.body;
        if(!model){
            return res.status(400).json({
                message:"Model name is missing"
            })
        }
        const newChat=await Chat.create({
            userId:req.user._id,
            model
        })
        res.status(201).json({
            chatId:newChat._id,
            userId:req.user._id,
            model,
            topic:newChat.topic
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
export const getRecentChat=async(req,res)=>{
    try{
        const recentChats=await Chat.find({userId:req.user._id}).sort({updatedAt:-1}).limit(20).select("topic model updatedAt ");
        res.status(200).json({
            message:"Your all recent chats",
            recentChats
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
export const getSingleChat=async(req,res)=>{
    try{
        const {chatId}=req.params;
        const chat=await Chat.findOne({_id:chatId,userId:req.user._id});
        if(!chat){
            return res.status(403).json({
                message:"Sorry not found"
            })
        }
        res.status(200).json({
            chatId:chat._id,
            userId:chat.userId,
            topic:chat.topic,
            usage:chat.usage
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }

}
export const deleteChat=async(req,res)=>{
    try{
        const {chatId}=req.params;
        const chat=await Chat.findOne({_id:chatId,userId:req.user._id});
        if(!chat){
            return res.status(403).json({
                message:"You are not allowed to do this"
            })
        }
        await Chat.deleteOne({
            _id:chatId
        });
        await Message.deleteMany({
            chatId:chat._id
        })
        res.status(200).json({
            message:"Your chat deleted successfully"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
    
}
