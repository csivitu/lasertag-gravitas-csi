import express from "express";
import SendMailController from "../controllers/sendmailcontroller.js";

const sendmail = express.Router();

sendmail.post("/", SendMailController);

export default sendmail;