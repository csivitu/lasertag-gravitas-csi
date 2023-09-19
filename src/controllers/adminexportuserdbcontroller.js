import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";
import fs from "fs";

const AdminExportUserDbController = catchAsync(
    async (req, res) => {
        let {adminMail} = req.admin;

        const users = await User.find({}).populate("slotBooked");
        const jsonUsers = JSON.stringify(users, null, 2);
        const userfile = "exportedUsers.json";

        fs.writeFileSync(userfile, jsonUsers);
        res.download(userfile, (err) => {
            Logger.error(`Error exporting slot DB for ${adminMail}: ${err}`);
            return res.status(500).json({error: "Error giving slot json file as attachment."});
        });
        fs.unlinkSync(userfile);
    }
);

export default AdminExportUserDbController;