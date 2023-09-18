import express from "express";
import protect from "../middleware/protect.js";
import requireAdmin from "../middleware/requireAdmin.js";
import AdminSetSlotController from "../controllers/adminsetslotcontroller.js";

const adminsetslot = express.Router();

adminsetslot.post("/", protect, requireAdmin, AdminSetSlotController);

export default adminsetslot;