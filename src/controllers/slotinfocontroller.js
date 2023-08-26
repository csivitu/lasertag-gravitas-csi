import catchAsync from "../helpers/catchAsync";
import Slot from "../models/slotModel";

const SlotInfoController = catchAsync(
    async (req, res) => {
        const slots = await Slot.find({}, {slotBookedBy: 0})
        .catch((err) => {
            console.log("Slot retrieval error from Database: " + err.message);
            res.status(500).json({error: "Unable to retrieve slots from DB"});
        });
        res.status(200).json(slots);
    }
);

export default SlotInfoController;