import express from "express";
import protect from "../middleware/protect.js";
import verifyslot from "../middleware/verifyslot.js";
import ChangeSlotController from "../controllers/changeslotcontroller.js";
import requireNotScanned from "../middleware/requireNotScanned.js";

const changeslot = express.Router();

changeslot.post("/", protect, verifyslot, requireNotScanned, ChangeSlotController);

export default changeslot;