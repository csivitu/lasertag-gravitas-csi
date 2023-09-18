import express from "express";
import CreateSlotDataController from "../controllers/slotdata.js";

const createslotdata = express.Router();

createslotdata.post("/", CreateSlotDataController);

export default createslotdata;