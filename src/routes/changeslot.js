import express from "express";
import protect from "../middleware/protect.js";
import verifyslot from "../middleware/verifyslot.js";
import ChangeSlotController from "../controllers/changeslotcontroller.js";

const changeslot = express.Router();

changeslot.post("/", protect, verifyslot, ChangeSlotController);

export default changeslot;