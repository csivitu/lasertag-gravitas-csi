import express from "express";
import VerifyUserController from "../controllers/verifyusercontroller";

const verifyuser = express.Router();

verifyuser.post("/", VerifyUserController);

export default verifyuser;