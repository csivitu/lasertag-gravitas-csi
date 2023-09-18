import express from "express";
import protect from "../middleware/protect.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";
import AdminCancelSlotController from "../controllers/admincancelslotcontroller.js";

const admincancelslot = express.Router();

admincancelslot.post("/", protect, requireSuperAdmin, AdminCancelSlotController);

export default admincancelslot;