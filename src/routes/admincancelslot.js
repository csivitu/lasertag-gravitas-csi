import express from "express";
import protect from "../middleware/protect.js";
import requireAdmin from "../middleware/requireAdmin.js";
import AdminCancelSlotController from "../controllers/admincancelslotcontroller.js";

const admincancelslot = express.Router();

admincancelslot.post("/", protect, requireAdmin, AdminCancelSlotController);

export default admincancelslot;