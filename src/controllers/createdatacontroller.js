import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import moment from "moment-timezone";

const CreateDataController = catchAsync(
    async (req, res) => {
        User.deleteMany({});
        Slot.deleteMany({});
        User.create([
            {
                regno: "22BCE2700",
                phoneno: "7483555328",
                email: "yoswal99@gmail.com"
            },
            {
                regno: "22BKT0060",
                email: "manaslaud@hotmail.com"
            }
        ])
        .then((createdUser) => {
            console.log("User Created: " + createdUser);
        })
        .catch((err) => {
            console.log("Unable to create User: " + err);
        });

        Slot.create([
            {
                startTime: new moment.tz("2023-09-17T08:00:00", 'Asia/Kolkata').utc().toDate(),
                endTime: new moment.tz("2023-09-17T08:10:00", 'Asia/Kolkata').utc().toDate(),
                day: 1,
                isCarry: true
            },
            {
                startTime: new moment.tz("2023-09-17T08:15:00", 'Asia/Kolkata').utc().toDate(),
                endTime: new moment.tz("2023-09-17T08:25:00", 'Asia/Kolkata').utc().toDate(),
                day: 1,
                isCarry: true
            },
            {
                startTime: new moment.tz("2023-09-17T08:30:00", 'Asia/Kolkata').utc().toDate(),
                endTime: new moment.tz("2023-09-17T08:40:00", 'Asia/Kolkata').utc().toDate(),
                day: 1,
                isCarry: true
            },
            {
                startTime: new moment.tz("2023-09-17T08:45:00", 'Asia/Kolkata').utc().toDate(),
                endTime: new moment.tz("2023-09-17T08:55:00", 'Asia/Kolkata').utc().toDate(),
                day: 1,
                isCarry: false
            },
            {
                startTime: new moment.tz("2023-09-17T09:00:00", 'Asia/Kolkata').utc().toDate(),
                endTime: new moment.tz("2023-09-17T09:10:00", 'Asia/Kolkata').utc().toDate(),
                day: 1,
                isCarry: false
            }
        ])
        .then(() => {console.log("Slot successfully created.")})
        .catch((err) => {console.log("Slot unable to be created." + err)});

        Logger.info("Dummy data created.");
        return res.status(200).json({message: "Dummy data succesfully created."});
    }
);

export default CreateDataController;