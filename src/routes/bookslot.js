import express from "express";
import protect from "../middleware/protect.js";
import verifyslot from "../middleware/verifyslot.js";
import BookSlotController from "../controllers/bookslotcontroller.js";

const bookslot = express.Router();

bookslot.post("/", protect, verifyslot, BookSlotController);

export default bookslot;