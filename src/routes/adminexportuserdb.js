import express from "express";
import protect from "../middleware/protect.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";
import AdminExportUserDbController from "../controllers/adminexportuserdbcontroller.js";

const adminexportuserdb = express.Router();

adminexportuserdb.post("/", protect, requireSuperAdmin, AdminExportUserDbController);

export default adminexportuserdb;