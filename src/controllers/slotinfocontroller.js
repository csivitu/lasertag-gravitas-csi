import catchAsync from "../helpers/catchAsync.js";
import Slot from "../models/slotModel.js";

const SlotInfoController = catchAsync(
    async (req, res) => {
        const slots = await Slot.find({}, {slotBookedBy: 0})
        .sort({day: 1, startTime: 1})
        .catch((err) => {
            console.log("Slot retrieval/sorting error: " + err.message);
            return res.status(500).json({error: "Unable to retrieve/sort Slots from Database"});
        });

        return res.status(200).json(slots);
    }
);

export default SlotInfoController;