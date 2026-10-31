import express from "express"
import {signup,login,logout,profile,deleteUser} from "../controllers/userControllers.js";
import authUserMiddleware from "../middleware/authUserMiddleware.js";
import { unauthenticateedRateLimiter } from "../middleware/unauthenticatedRateLimiter.js";
import { authenticatedRateLimiter } from "../middleware/authenticatedRateLimiter.js";
import loadUserMiddleware from "../middleware/loadUserMiddleware.js";
//login  //logout  //signup  //profile
const userRouter=express.Router();
userRouter.post("/login",unauthenticateedRateLimiter,login);
userRouter.post("/logout",authUserMiddleware,authenticatedRateLimiter,logout);
userRouter.post("/signup",unauthenticateedRateLimiter,signup);
userRouter.get("/profile",authUserMiddleware,authenticatedRateLimiter,loadUserMiddleware,profile);
userRouter.delete("/delete",authUserMiddleware,loadUserMiddleware,deleteUser)
export default userRouter;