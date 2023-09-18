import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";

const AdminSetSlotController = catchAsync(
    async (req, res) => {
        let {slotId, toShow} = req.body;
        let {adminMail} = req.admin;

        const user = User.find({email: adminMail});
        const slot = Slot.findById(slotId);

        if (!slot) {
            Logger.info("Invalid Slot ID for Slot state change.");
            return res.status(400).json({error: "Invalid Slot ID for Slot state change."});
        }

        slot.toShow = toShow;
        Logger.info(`${adminMail} changed state of ${slot} to ${toShow}.`);
        return res.status(200).json({message: "Successfully changed state of selected slot."});
    }
);

export default AdminSetSlotController;