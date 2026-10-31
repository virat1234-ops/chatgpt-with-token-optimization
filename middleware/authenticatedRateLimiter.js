import { redisClient } from "../config/redis.js";
export const authenticatedRateLimiter=async(req,res,next)=>{
    try{
        const userId=req.userId;
        const key=`rate-limiter:user:${userId}`;
        const requestCount=await redisClient.incr(key);
        if(requestCount===1){
            await redisClient.expire(key,60);
        }
        if(requestCount>20){
            const remainingTime=await redisClient.ttl(key);
            return res.status(429).json({
                message:"Too many request"
            });
        }
        next();
    }
    catch(error){
        console.log("Authenticated rate limiter error:",error);
        next();
    }
}
