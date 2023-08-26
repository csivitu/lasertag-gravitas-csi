import express from "express";
import protect from "../middleware/protect";
import UserInfoController from "../controllers/userinfocontroller";

const userinfo = express.Router();

userinfo.get("/", protect, UserInfoController);

export default userinfo;