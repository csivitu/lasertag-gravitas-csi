import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";
import Logger from "../initializers/logger.js";

const AdminCancelSlotController = catchAsync(
    async (req, res) => {
        let {adminMail} = req.admin;
        let {email} = req.body;

        const user = await User.findOne({email: email});

        if (!user) {
            Logger.info(`${email} is an invalid user email id for admin to cancel slot.`);
            return res.status(400).json({error: "Invalid Email-ID entered."});
        }
        if (user.slotBooked == null) {
            Logger.info(`ADMIN ${adminMail} attempted to cancel non-existing slot for ${email}`);
            return res.status(400).json({message: "User doesn't have any slot booked."});
        }

        const slot = await Slot.findById(user.slotBooked);

        if (!slot) {
            Logger.info(`ADMIN ${adminMail} attempted to cancel invalid slot.`);
            return res.status(400).json({error: "Invalid Slot / Slot not Found"});
        }

        user.slotBooked = null;

        slot.slotBookedBy = slot.slotBookedBy.filter(
            (id) => id.toString() != (user._id).toString()
        );

        await Promise.all([user.save(), slot.save()]);
        Logger.info(`ADMIN ${adminMail} cancelled slot ${slot.startTime} booked for ${email}.`);
        return res.status(200).json({message: "Slot successfully cancelled for " + email});
    }
);

export default AdminCancelSlotController;