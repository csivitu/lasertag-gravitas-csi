import express from "express";
import protect from "../middleware/protect.js";
import requireAdmin from "../middleware/requireAdmin.js";
import AdminSlotInfoController from "../controllers/adminslotinfocontroller.js";

const adminslotinfo = express.Router();

adminslotinfo.get("/", protect, requireAdmin, AdminSlotInfoController);

export default adminslotinfo;