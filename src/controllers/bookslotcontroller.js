import catchAsync from "../helpers/catchAsync";
import envHandler from "../helpers/envHandler";
import Slot from "../models/slotModel";
import User from "../models/userModel";

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
    }
);

export default BookSlotController;