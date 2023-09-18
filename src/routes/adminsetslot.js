import express from "express";
import protect from "../middleware/protect.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";
import AdminSetSlotController from "../controllers/adminsetslotcontroller.js";

const adminsetslot = express.Router();

adminsetslot.post("/", protect, requireSuperAdmin, AdminSetSlotController);

export default adminsetslot;