import express from "express";

const register = express.Router();

register.post("/", registrationController);

export default register;