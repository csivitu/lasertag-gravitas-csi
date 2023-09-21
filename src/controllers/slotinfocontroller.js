import catchAsync from "../helpers/catchAsync.js";
import Slot from "../models/slotModel.js";
import Logger from "../initializers/logger.js";
import moment from "moment-timezone";

const SlotInfoController = catchAsync(
    async (req, res) => {
        const slots = await Slot.find({toShow: true, isCarry: false, day: {$in: [1, 2]}})
        .populate({path: "slotBookedBy", select: "name"})
        .sort({day: 1, startTime: 1})
        .catch((err) => {
            Logger.error(`Slot retrieval/sorting error (Get Slot Info Error):  + ${err.message}`);
            return res.status(500).json({error: "Unable to retrieve/sort Slots from Database"});
        });

        const adjustedSlots = slots.map((slot) => {
            const adjustedStartTime = new moment.tz(slot.startTime.getTime() - 10 * 60 * 1000, 'UTC');
            const adjustedEndTime = new moment.tz(slot.endTime.getTime() - 10 * 60 * 1000, 'UTC');
        
            // Create a new object with adjusted times and other properties
            return {
              ...slot.toObject(),
              startTime: adjustedStartTime,
              endTime: adjustedEndTime,
            };
        });

        Logger.info("Successfully returned slot info as response.");
        Logger.info(`Returned slot info for: ${adjustedSlots.length} slots.`);
        return res.status(200).json(adjustedSlots);
    }
);

export default SlotInfoController;