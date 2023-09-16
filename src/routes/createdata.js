import express from "express";
import CreateDataController from "../controllers/createdatacontroller.js";

const createdata = express.Router();

createdata.post("/", CreateDataController);

export default createdata;