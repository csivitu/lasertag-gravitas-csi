import catchAsync from "../helpers/catchAsync.js";
import Slot from "../models/slotModel.js";
import Logger from "../initializers/logger.js";

const AdminSlotInfoController = catchAsync(
    async (req, res) => {
        const slots = await Slot.find({})
        .populate("slotBookedBy")
        .sort({day: 1, startTime: 1})
        .catch((err) => {
            Logger.error(`Slot retrieval/sorting error (Get Slot Info Error):  + ${err.message}`);
            return res.status(500).json({error: "Unable to retrieve/sort Slots from Database"});
        });

        Logger.info("Successfully returned slot info as response.");
        return res.status(200).json(slots);
    }
);

export default AdminSlotInfoController;