import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import transporter from "../initializers/transporter.js";
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

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        await Promise.all([slot.save(), user.save()]);

        // const mailOptions = {
        //     from: envHandler('MAILER'),
        //     to: user.email,
        //     subject: "Confirmation of Slot Booking",
        //     text: `Your slot is successfully booked from ${slot.startTime} to ${slot.endTime} on Day ${slot.day} of Gravitas` 
        // };

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         Logger.error(`Error in sending slot booked mail (Transporter error): ${error}`);
        //         return res.status(500).json({error: "Failed to send Slot Booking email"});
        //     }
        //     Logger.info(`Booked slot email sent for ${user.email} successfully.`);
        // });

        return res.status(200).json({message: "Slot successfully booked."});
    }
);

export default BookSlotController;