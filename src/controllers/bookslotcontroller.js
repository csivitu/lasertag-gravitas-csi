import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

const BookSlotController = catchAsync(
    async (req, res) => {
        let {slotId} = req.body;
        let userID = req.userID.userID;

        const slot = await Slot.findById(slotId).populate("slotBookedBy");
        const user = await User.findById(userID).populate("slotBooked");

        if (!user) {
            console.log("User not Found");
            return res.status(400).json({error: "User not Found"});
        }
        if (user.slotBooked != null) {
            return res.status(400).json({error: "User has already booked slot. To change, please click Change Slot."});
        }

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        await Promise.all([slot.save(), user.save()]);

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "your-email@some.com",
                pass: "some-password"
            }
        });

        const mailOptions = {
            from: "your-email@some.com",
            to: user.email,
            subject: "Confirmation of Slot Booking",
            text: `Your slot is successfully booked from ${slot.startTime} to ${slot.endTime} on Day ${slot.day} of Gravitas` 
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({error: "Failed to send Slot Booking email"});
            }
            console.log("Slot booking email sent: " + info.response);
            return res.status(200).json({message: "Slot successfully booked."});
        });
    }
);

export default BookSlotController;