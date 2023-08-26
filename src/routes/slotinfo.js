import express from "express";
import protect from "../middleware/protect.js";
import SlotInfoController from "../controllers/slotinfocontroller.js";

const slotinfo = express.Router();

slotinfo.get("/", protect, SlotInfoController);

export default slotinfo;