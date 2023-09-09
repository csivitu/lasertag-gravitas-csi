import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";
import Logger from "../initializers/logger.js";

const ChangeSlotController = catchAsync(
    async (req, res) => {
        let {slotId} = req.body;
        let {userID} = req.userID;

        const user = await User.findById(userID);

        if (user.slotBooked == null) {
            Logger.info(`${user.email} attempted change without booking slot.`);
            return res.status(400).json({error: "User has not yet booked slot. To book, please click Book Slot."});
        }

        const slot = await Slot.findById(slotId);
        const oldSlot = await Slot.findById(user.slotBooked);

        if (!oldSlot) {
            Logger.info(`${user.email} has invalid booked slot.`);
            return res.status(400).json({error: "Already booked slot is invalid."});
        }
        if (oldSlot.startTime.getTime() < new Date().getTime()) {
            Logger.info(`${user.email} attempted change when booked slot time has already passed.`);
            return res.status(400).json({error: "Booked slot time has already passed."});
        }
        if ((oldSlot.startTime.getTime() - new Date().getTime()) < (9 * 60 * 60 * 1000)) {
            Logger.info(`${user.email} not allowed change slot since within 9 hours of booked slot time.`);
            return res.status(400).json({error: 
                "Slot change is not allowed within 9 hours of the already booked slot."});
        }

        oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter(
            (id) => id.toString() != (user._id).toString()
        );

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        await Promise.all([oldSlot.save(), slot.save(), user.save()]);

        Logger.info(`${user.email} successfully changed slot to ${slot.startTime}.`);
        return res.status(200).json({message: "Slot successfully changed."});
    }
);

export default ChangeSlotController;