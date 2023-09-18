import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";
import envHandler from "../helpers/envHandler.js";
import Logger from "../initializers/logger.js";

const AdminAssignSlotController = catchAsync(
    async (req, res) => {
        let {adminMail} = req.admin;
        let {email, slotId} = req.body;
        email.trim();

        const user = await User.findOne({email: email});

        if (!user) {
            Logger.info(`${email} is an invalid user email id for admin to cancel slot.`);
            return res.status(400).json({error: "Invalid Email-ID entered."});
        }

        const slot = await Slot.findById(slotId);

        if (!slot) {
            Logger.info(`ADMIN ${adminMail} attempted to assign invalid slot.`);
            return res.status(400).json({error: "Invalid Slot / Slot not Found"});
        }

        if (user.slotBooked != null) {
            const oldSlot = await Slot.findById(user.slotBooked);

            oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter(
                (id) => id.toString() != (user._id).toString()
            );
            await oldSlot.save();
        }

        user.slotBooked = slot;
        slot.slotBookedBy.push(user);
        user.QR.isScanned = false;
        // optional: send email with new qr code
        await Promise.all([user.save(), slot.save()]);
        Logger.info(`ADMIN ${adminMail} assigned slot ${slot.startTime} to ${email}.`);
        return res.status(400).json({message: `Successfully assigned slot ${slot.startTime} to ${email}.`});
    }
);

export default AdminAssignSlotController;