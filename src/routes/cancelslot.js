import express from "express";
import protect from "../middleware/protect.js";
import CancelSlotController from "../controllers/cancelslotcontroller.js";

const cancelslot = express.Router();

cancelslot.post("/", protect, CancelSlotController);

export default cancelslot;