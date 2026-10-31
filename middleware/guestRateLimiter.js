import { redisClient } from "../config/redis.js";

// Guest chat is rate-limited by IP, but it does not write chat data to MongoDB.
const guestRateLimiter = async (req, res, next) => {
    try {
        const key = `guest-chat-rate:${req.ip}`;
        const requestCount = await redisClient.incr(key);

        if (requestCount === 1) {
            await redisClient.expire(key, 60);
        }

        if (requestCount > 20) {
            const remainingTime = await redisClient.ttl(key);
            return res.status(429).json({
                message: `Guest chat is temporarily rate-limited. Try again in ${Math.max(remainingTime, 1)} seconds.`,
            });
        }

        next();
    } catch (error) {
        // If Redis is temporarily unavailable, let the endpoint respond normally.
        console.error("Guest chat rate limiter error:", error.message);
        next();
    }
};

export default guestRateLimiter;
