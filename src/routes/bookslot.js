import express from "express";
import protect from "../middleware/protect.js";
import verifyslot from "../middleware/verifyslot.js";
import BookSlotController from "../controllers/bookslotcontroller.js";
import requireNotScanned from "../middleware/requireNotScanned.js";

const bookslot = express.Router();

bookslot.post("/", protect, verifyslot, requireNotScanned, BookSlotController);

export default bookslot;