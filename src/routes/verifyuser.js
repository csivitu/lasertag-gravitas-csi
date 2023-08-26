import express from "express";
import VerifyUserController from "../controllers/verifyusercontroller.js";

const verifyuser = express.Router();

verifyuser.post("/", VerifyUserController);

export default verifyuser;