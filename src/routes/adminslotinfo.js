import express from "express";
import protect from "../middleware/protect.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";
import AdminSlotInfoController from "../controllers/adminslotinfocontroller.js";

const adminslotinfo = express.Router();

adminslotinfo.get("/", protect, requireSuperAdmin, AdminSlotInfoController);

export default adminslotinfo;