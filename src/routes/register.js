import express from "express";

const register = express.Router();

register.post("/", RegistrationController);

export default register;