import express from "express";
import protect from "../middleware/protect";
import SlotInfoController from "../controllers/slotinfocontroller";

const slotinfo = express.Router();

slotinfo.get("/", protect, SlotInfoController);

export default slotinfo;