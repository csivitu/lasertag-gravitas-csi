import express from "express";
import protect from "../middleware/protect.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";
import AdminExportSlotDbController from "../controllers/adminexportslotdbcontroller.js";

const adminexportslotdb = express.Router();

adminexportslotdb.post("/", protect, requireSuperAdmin, AdminExportSlotDbController);

export default adminexportslotdb;