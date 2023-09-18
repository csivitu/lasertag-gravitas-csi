import express from "express";
import protect from "../middleware/protect.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";
import AdminAssignSlotController from "../controllers/adminassignslotcontroller.js";

const adminassignslot = express.Router();

adminassignslot.post("/", protect, requireSuperAdmin, AdminAssignSlotController);

export default adminassignslot;