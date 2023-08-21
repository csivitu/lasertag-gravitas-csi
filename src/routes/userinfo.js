import express from "express";

const userinfo = express.Router();

userinfo.get("/", UserInfoController);

export default userinfo;
