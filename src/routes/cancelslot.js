import express from "express";
import protect from "../middleware/protect.js";
import CancelSlotController from "../controllers/cancelslotcontroller.js";
import requireNotScanned from "../middleware/requireNotScanned.js";

const cancelslot = express.Router();

cancelslot.post("/", protect,requireNotScanned, CancelSlotController);

export default cancelslot;