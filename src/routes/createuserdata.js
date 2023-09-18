import express from "express";
import CreateUserDataController from "../controllers/createuserdatacontroller.js";

const createuserdata = express.Router();

createuserdata.post("/", CreateUserDataController);

export default createuserdata;