import express from "express";
import { allUserController, login, logout, profileController, register } from "../controllers/userController.js";
import { hasToken } from "../middleware/hasToken.js";
import { verifyToken } from "../middleware/verifyToken.js";

const userRoute = express.Router()

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/verify", verifyToken)
userRoute.get("/profile", hasToken, profileController);
userRoute.get("/all-users", hasToken, allUserController);
userRoute.delete("/logout", hasToken,logout)

export default userRoute;