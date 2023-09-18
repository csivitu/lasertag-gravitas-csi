import Slot from "../models/slotModel.js";
import catchAsync from "../helpers/catchAsync.js";
import moment from "moment-timezone";

const year = 2023;
const month = 9;
const monthDays = [22, 23, 24];
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const mins = [0, 10, 15, 25, 30, 40, 45, 55];
const curTimezone = 'Asia/Kolkata';
const targetTimezone = 'UTC';

const CreateSlotDataController = catchAsync(
    async () => {
        for (let dy of monthDays) {
        let carrySlotTime = new moment.tz([year, month, dy, 8, 30, 0], curTimezone).tz(targetTimezone).toDate();
        for (let hr of hours) {
            for (let mn = 0; mn < mins.length; mn += 2) {
                let startTime = new moment.tz([year, month, dy, hr, mins[mn], 0], curTimezone).tz(targetTimezone).toDate();
                let endTime = new moment.tz([year, month, dy, hr, mins[mn + 1], 0], curTimezone).tz(targetTimezone).toDate();
                let day = 1;
                let isCarry = false;
                if (dy == 22) {
                    day = 1;
                }
                else if (dy == 23) {
                    day = 2;
                }
                else {
                    day = 3;
                }
                if (hr == 8) {
                    if (startTime.getTime() <= carrySlotTime.getTime()) {
                        isCarry = true;
                    }
                }
                
                let newSlot = {
                    startTime: startTime,
                    endTime: endTime,
                    day: day,
                    isCarry: isCarry
                };

                Slot.create([newSlot])
                .catch((err) => {
                    console.log(`Slot unable to be created: ${err}`);
                });
            }
        }
    }
});

export default CreateSlotDataController;