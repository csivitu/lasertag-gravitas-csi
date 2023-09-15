import catchAsync from "../helpers/catchAsync.js";
import Slot from "../models/slotModel.js";
import Logger from "../initializers/logger.js";

const SlotInfoController = catchAsync(
    async (req, res) => {
        const slots = await Slot.find({})
        .sort({day: 1, startTime: 1})
        .catch((err) => {
            Logger.error(`Slot retrieval/sorting error (Get Slot Info Error):  + ${err.message}`);
            return res.status(500).json({error: "Unable to retrieve/sort Slots from Database"});
        });

        const excludedField = "slotBookedBy";
        const userSlots = await slots.map((document) => {
            let docjson = document.toJSON();
            const {[excludedField]: slotBookedBy, ...filtered} = docjson;
            return filtered;
        });

        Logger.info("Successfully returned slot info as response.");
        Logger.info(`Returned slot info for: ${userSlots.length} slots.`);
        return res.status(200).json(userSlots);
    }
);

export default SlotInfoController;