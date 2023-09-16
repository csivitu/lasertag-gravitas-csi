import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";

const BookSlotController = catchAsync(
    async (req, res) => {
        let {slotId} = req.body;
        let {userID} = req.userID;

        const slot = await Slot.findById(slotId).populate("slotBookedBy");
        const user = await User.findById(userID).populate("slotBooked");

        if (!user) {
            Logger.info(`${userID}: User not Found`);
            return res.status(400).json({error: "User not Found"});
        }
        if (user.slotBooked != null) {
            Logger.info(`${user.email}: User slot already booked. Will have to click on change slot.`);
            return res.status(400).json({error: "User has already booked slot. To change, please click Change Slot."});
        }

        await fetch(envHandler('MAILER'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: user.email,
                from: "Team CSI <Askcsivit@gmail.com>",
                subject: "Slot Booking Confirmation",
                text: `You have successfully booked a slot for ${slot.startTime}`,
                auth: envHandler('MLRPASS')
            })
        })
        .then((info) => {
            Logger.info(`${user.email} booked slot successfully: ${info.message}`);
        })
        .catch((err) => {
            Logger.error(`Mailer Error: ${err}: Unable to send mail for ${user.email} for slot booking.`);
            return res.status(500).json({error: "Unable to send Mail"});
        });

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        await Promise.all([slot.save(), user.save()]);

        return res.status(200).json({message: "Slot successfully booked."});
    }
);

export default BookSlotController;