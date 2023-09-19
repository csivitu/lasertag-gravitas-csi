import catchAsync from "../helpers/catchAsync.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import fs from "fs";

const AdminExportSlotDbController = catchAsync(
    async (req, res) => {
        let {adminMail} = req.admin;

        const slots = await Slot.find({}).populate("slotBookedBy");
        const slotfile = "exportedSlots.json";

        for (let content of slots) {
            const jsonSlot = JSON.stringify(content, null, 2);
            fs.writeFileSync(slotfile, jsonSlot + '\n', {flag: 'a+'}, (err) => {
                Logger.error(`Error when writing slot file: ${err}`);
                return res.status(500).json({error: "Error when writing slot file."});
            });
        }

        res.download(slotfile, (err) => {
            if (err) {
                Logger.error(`Error exporting slot DB for ${adminMail}: ${err}`);
                return res.status(500).json({error: "Error giving slot json file as attachment."});
            }

            fs.unlinkSync(userfile);
        });
    }
);

export default AdminExportSlotDbController;