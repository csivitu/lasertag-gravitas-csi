import express from "express";
import protect from "../middleware/protect.js";
import requireAdmin from "../middleware/requireAdmin.js";
import AdminAssignSlotController from "../controllers/adminassignslotcontroller.js";

const adminassignslot = express.Router();

adminassignslot.get("/", protect, requireAdmin, AdminAssignSlotController);

export default adminassignslot;