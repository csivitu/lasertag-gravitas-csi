import express from "express";

const login = express.Router();

login.post("/", LoginController);

export default login;