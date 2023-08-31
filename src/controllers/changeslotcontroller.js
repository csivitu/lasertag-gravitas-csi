import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";

const ChangeSlotController = catchAsync(
    async (req, res) => {
        let {slotId} = req.body;
        let userID = req.userID;

        const user = await User.findById(userID);

        if (user.slotBooked == null) {
            return res.status(400).json({error: "User has not yet booked slot. To book, please click Book Slot."});
        }

        const slot = await Slot.findById(slotId);
        const oldSlot = await Slot.findById(user.slotBooked);

        if (!oldSlot) {
            return res.status(400).json({error: "Already booked slot is invalid."});
        }
        if (oldSlot.getTime() < new Date().getTime()) {
            return res.status(400).json({error: "Booked slot time has already passed."});
        }
        if (oldSlot.getTime() - new Date().getTime() < 9 * 60 * 60 * 1000) {
            return res.status(400).json({error: 
                "Slot change is not allowed within 9 hours of the already booked slot."});
        }
        
        oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter(
            (id) => id != user._id
        );

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        await Promise.all([oldSlot.save(), slot.save(), user.save()]);
    }
);

export default ChangeSlotController;