import express from "express";
import UserInfoController from "../controllers/userinfocontroller";

const userinfo = express.Router();

userinfo.get("/", UserInfoController);

export default userinfo;