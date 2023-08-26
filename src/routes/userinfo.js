import express from "express";
import protect from "../middleware/protect.js";
import UserInfoController from "../controllers/userinfocontroller.js";

const userinfo = express.Router();

userinfo.get("/", protect, UserInfoController);

export default userinfo;