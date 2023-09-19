import catchAsync from "../helpers/catchAsync.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import fs from "fs";

const AdminExportSlotDbController = catchAsync(
    async (req, res) => {
        let {adminMail} = req.admin;

        const slots = await Slot.find({}).populate("slotBookedBy");
        const jsonSlots = JSON.stringify(slots, null, 2);
        const slotfile = "exportedSlots.json";

        fs.writeFileSync(slotfile, jsonSlots);
        res.download(slotfile, (err) => {
            Logger.error(`Error exporting slot DB for ${adminMail}: ${err}`);
            return res.status(500).json({error: "Error giving slot json file as attachment."});
        });
        fs.unlinkSync(slotfile);
    }
);

export default AdminExportSlotDbController;