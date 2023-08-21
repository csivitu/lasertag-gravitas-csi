import express from "express";

const userinfo = express.Router();

userinfo.get("/", getUserInfo);

export default userinfo;
