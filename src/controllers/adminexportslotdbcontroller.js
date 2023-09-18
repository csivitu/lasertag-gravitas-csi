import catchAsync from "../helpers/catchAsync.js";
import Slot from "../models/slotModel.js";
import fs from "fs";

const AdminExportSlotDbController = catchAsync(
    async (req, res) => {
        let {adminMail} = req.admin;

        const slots = Slot.find({});
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