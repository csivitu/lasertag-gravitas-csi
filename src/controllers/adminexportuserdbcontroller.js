import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";
import Logger from "../initializers/logger.js";
import fs from "fs";

const AdminExportUserDbController = catchAsync(
    async (req, res) => {
        let {adminMail} = req.admin;

        const users = await User.find({}).populate("slotBooked");
        const userfile = "exportedUsers.json";

        for (let content of users) {
            const jsonUser = JSON.stringify(content, null, 2);
            fs.writeFileSync(userfile, jsonUser + '\n', {flag: 'a+'}, (err) => {
                Logger.error(`Error when writing user file: ${err}`);
                return res.status(500).json({error: "Error when writing user file."});
            });
        }

        res.download(userfile, (err) => {
            if (err) {
                Logger.error(`Error exporting user DB for ${adminMail}: ${err}`);
                return res.status(500).json({error: "Error giving user json file as attachment."});
            }

            fs.unlinkSync(userfile);
        });
    }
);

export default AdminExportUserDbController;