import express from "express"
import {signup,login,logout,profile,deleteUser} from "../controllers/userControllers.js";
import authUserMiddleware from "../middleware/authUserMiddleware.js";
//login  //logout  //signup  //profile
const userRouter=express.Router();


userRouter.post("/login",login);
userRouter.post("/logout",logout);
userRouter.post("/signup",signup);
userRouter.get("/profile",authUserMiddleware,profile);
userRouter.delete("/delete",authUserMiddleware,deleteUser)
export default userRouter;