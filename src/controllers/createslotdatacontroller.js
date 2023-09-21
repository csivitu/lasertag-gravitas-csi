import Slot from "../models/slotModel.js";
import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import envHandler from "../helpers/envHandler.js";
import moment from "moment-timezone";
import fs from "fs";

const year = 2023;
const month = 8;
const monthDays = [22];
const hours = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18];
const mins = [0, 10, 15, 25, 30, 40, 45, 55];
const curTimezone = 'Asia/Kolkata';
const targetTimezone = 'UTC';

const CreateSlotDataController = catchAsync(
    async (req, res) => {
        let {password} = req.body;
        if (password != envHandler('SUPERADMIN_PASS')) {
            Logger.info('Wrong password entered for creating data');
            return res.status(400).json({error: "Bad auth: You are not allowed to create data."});
        }
        // for (let dy of monthDays) {
        // for (let hr of hours) {
        //     for (let mn = 0; mn < mins.length; mn += 2) {
        //         let startTime = new moment.tz([year, month, dy, hr, mins[mn], 0], curTimezone).tz(targetTimezone).toDate();
        //         let endTime = new moment.tz([year, month, dy, hr, mins[mn + 1], 0], curTimezone).tz(targetTimezone).toDate();
        //         let day = 1;
        //         let isCarry = false;
        //         if (hr == 16 && (mins[mn] < 30)) {
        //             continue;
        //         }
        //         if (dy == 22) {
        //             day = 1;
        //         }
        //         else if (dy == 23) {
        //             day = 2;
        //         }
        //         else {
        //             day = 3;
        //         }
        //         if (hr == 8 && (mins[mn] <= 30)) {
        //             isCarry = true;
        //         }
                
        //         let newSlot = {
        //             startTime: startTime,
        //             endTime: endTime,
        //             day: day,
        //             isCarry: isCarry
        //         };

        //         await Slot.create([newSlot])
        //         .catch((err) => {
        //             console.log(`Slot unable to be created: ${err}`);
        //         });
        //     }
        // }
        
        
        // for (let dy of monthDays) {
        //     const hr = 12;
        //     for (let mn = 0; mn < mins.length; mn += 2) {
        //         let startTime = new moment.tz([year, month, dy, hr, mins[mn], 0], curTimezone).tz(targetTimezone).toDate();
        //         let endTime = new moment.tz([year, month, dy, hr, mins[mn + 1], 0], curTimezone).tz(targetTimezone).toDate();
        //         let day = 1;
        //         if (dy == 22) {
        //             day = 1;
        //         } else if (dy == 23) {
        //             day = 2;
        //         } else {
        //             day = 3;
        //         }
        //         let newSlot = {
        //             startTime,
        //             endTime,
        //             day
        //         };
                
        //         await Slot.create([newSlot])
        //         .catch((err) => {
        //             Logger.error(`Error creating ${newSlot}: ${err.message}`);
        //             return res.status(500).json({error: "Unable to create additional slots."});
        //         })
        //         .then((slot) => {
        //             Logger.info(`Successfully created slot: ${slot}`);
        //         })
        //     }
        // }

    
        let slots = await Slot.find({day: 1, toShow: false, isCarry: false})
        .populate("slotBookedBy");
        const structuredSlots = slots.map((slot) => {
            if (slot.slotBookedBy.length > 0) {
                const lastTime = new Date(2023, 8, 22, 12, 0, 0);
                if (slot.startTime.getTime() < lastTime.getTime()) {
                    const userObjs = slot.slotBookedBy;
                    const mails = userObjs.map((user) => user.email);
                    return {startTime: slot.startTime, users: mails};
                }
            }
            else{
                return undefined;
            }
        });
        structuredSlots = JSON.stringify(structuredSlots);
        fs.writeFileSync('userdata.js', structuredSlots);
        res.download('userdata.js');
        // return res.status(200).json({message: "Slot data successfully created."});
});

export default CreateSlotDataController;