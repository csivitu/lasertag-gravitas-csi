import express from "express";
import protect from "../middleware/protect.js";
import CancelSlotController from "../controllers/cancelslotcontroller.js";
import requireNotScanned from "../middleware/requireNotScanned.js";
import requireAdmin from "../middleware/requireAdmin.js";

const cancelslot = express.Router();

cancelslot.post("/", protect, requireAdmin, requireNotScanned, CancelSlotController);

export default cancelslot;