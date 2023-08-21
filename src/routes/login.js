import express from "express";

const login = express.Router();

login.post("/", loginController);

export default login;