import catchAsync from "../helpers/catchAsync";
import envHandler from "../helpers/envHandler";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";

const BookSlotController = catchAsync(
    async (req, res) => {
        let {slotId} = req.body;
        let userID = req.userID;

        const slot = await Slot.findById(slotId).populate("slotBookedBy");
        const user = await User.findById(userID).populate("slotBooked");

        if (!user) {
            console.log("User not Found");
            return res.status(400).json({error: "User not Found"});
        }
        if (user.slotBooked != null) {
            return res.status(400).json({error: "User has already booked slot. To change, please click Change Slot."});
        }

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        await Promise.all([slot.save(), user.save()]);

        // Sending slot booking confirmation mail is left
    }
);

export default BookSlotController;