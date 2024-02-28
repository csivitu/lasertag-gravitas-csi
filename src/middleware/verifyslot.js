import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import Slot from "../models/slotModel.js";

const verifyslot = catchAsync(
    async (req, res, next) => {
        // return res.status(400).json({error: "Slot booking has now been officialy closed. Thank you for your participation!"});
        let {slotId} = req.body;
        const slot = await Slot.findById(slotId).populate("slotBookedBy");

        if (!slot) {
            return res.status(400).json({error: "Invalid Slot / Slot not Found"});
        }
        let envVar = "SLOTCAP" + slot.day;
        if (slot.slotBookedBy.length >= envHandler(envVar)) {
            return res.status(400).json({error: "Slot capacity reached or exceeded."});
        }
        if (!slot.toShow) {
            return res.status(400).json({error: "The slot has been closed and won't accept bookings."});
        }
        if (slot.startTime.getTime() < new Date().getTime()) {
            return res.status(400).json({error: "Slot has already started/finished."});
        }
        if (slot.isCarry == true) {
            return res.status(400).json({error: "User is trying to book a carry slot, this is not allowed. Only ADMINs may do so."});
        }

        next();
    }
);

export default verifyslot;