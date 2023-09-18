import express from "express";
import protect from "../middleware/protect.js";
import requireAdmin from "../middleware/requireAdmin.js";
import AdminScan from "../controllers/adminscancontroller.js";

const adminscan = express.Router();

adminscan.get("/:email", protect, requireAdmin, AdminScan);

export default adminscan;