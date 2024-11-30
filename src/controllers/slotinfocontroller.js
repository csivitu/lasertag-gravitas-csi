import catchAsync from "../helpers/catchAsync.js";
import Slot from "../models/slotModel.js";
import Logger from "../initializers/logger.js";
import moment from "moment-timezone";

const SlotInfoController = catchAsync(
    async (req, res) => {
        try {
            const slots = await Slot.find({ 
                toShow: true, 
                isCarry: false, 
                day: { $in: [2, 3] }
              })
              .populate({ path: "slotBookedBy", select: "name" })
              .sort({ day: 1, startTime: 1 });
            const slotsInIST = slots.map(slot => ({
                ...slot.toObject(),
                startTime: moment(slot.startTime).subtract(10, 'minutes').tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(slot.endTime).subtract(10, 'minutes').tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                availability: 10 - slot.slotBookedBy.length
            }));

            return res.status(200).json(slotsInIST);
        } catch (err) {
            console.error(`Error retrieving slots: ${err.message}`);
            return res.status(500).json({ error: "Unable to retrieve Slots from Database" });
        }
        // const slots = await Slot.find({ toShow: true, isCarry: false })
        //     // .populate({ path: "slotBookedBy", select: "name" })
        //     .sort({ day: 1, startTime: 1 })
        //     .catch((err) => {
        //         Logger.error(`Slot retrieval/sorting error (Get Slot Info Error):  + ${err.message}`);
        //         return res.status(500).json({ error: "Unable to retrieve/sort Slots from Database" });
        //     });
        //
        // return res.status(200).json(slots);
        // const adjustedSlots = slots.map((slot) => {
        //     const adjustedStartTime = new moment.tz(slot.startTime.getTime(), 'UTC');
        //     const adjustedEndTime = new moment.tz(slot.endTime.getTime(), 'UTC');
        //
        //     // Create a new object with adjusted times and other properties
        //     return {
        //         ...slot.toObject(),
        //         startTime: adjustedStartTime,
        //         endTime: adjustedEndTime,
        //     };
        // });
        //
        // Logger.info("Successfully returned slot info as response.");
        // Logger.info(`Returned slot info for: ${adjustedSlots.length} slots.`);
        // return res.status(200).json(adjustedSlots);
    }
);

export default SlotInfoController;
