import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";

const CancelSlotController = catchAsync(
    async (req, res) => {
        let userID = req.userID;

        const user = await User.findById(userID);

        if (!user) {
            return res.status(400).json({error: "Invalid User"});
        }
        if (user.slotBooked == null) {
            return res.status(400)
            .json({error: "User has not yet booked any slot. Please book a slot before cancelling it lol"});
        }

        const slot = await Slot.findById(user.slotBooked);

        if (!slot) {
            return res.status(400).json({error: "Invalid slot."});
        }

        slot.slotBookedBy = slot.slotBookedBy.filter(
            (id) => id != user._id
        );
        user.slotBooked = null;
        await Promise.all([slot.save(), user.save()]);
    }
);

export default CancelSlotController;