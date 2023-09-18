import express from "express";
import protect from "../middleware/protect.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";
import AdminExportSlotDbController from "../controllers/adminexportslotdbcontroller.js";

const adminexportdb = express.Router();

adminexportdb.post("/", protect, requireSuperAdmin, AdminExportSlotDbController);

export default adminexportslotdb;