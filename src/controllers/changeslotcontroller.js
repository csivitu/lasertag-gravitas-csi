import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";
import Logger from "../initializers/logger.js";
import envHandler from "../helpers/envHandler.js";
import nodemailer from "nodemailer";
import moment from "moment-timezone";
import fs from "fs";

const ChangeSlotController = catchAsync(
    async (req, res) => {
        let {slotId} = req.body;
        let {userID} = req.userID;

        const user = await User.findById(userID);

        if (user.slotBooked == null) {
            Logger.info(`${user.email} attempted change without booking slot.`);
            return res.status(400).json({error: "User has not yet booked slot. To book, please click Book Slot."});
        }

        const slot = await Slot.findById(slotId);
        const oldSlot = await Slot.findById(user.slotBooked);

        if (!oldSlot) {
            Logger.info(`${user.email} has invalid booked slot.`);
            return res.status(400).json({error: "Already booked slot is invalid."});
        }
        if (slot._id.toString() == oldSlot._id.toString()) {
            Logger.info(`${user.email} attempted an invalid change of slots.`);
            return res.status(400).json({error: "Pleae select a different slot to change to."});
        }
        if (oldSlot.startTime.getTime() < new Date().getTime()) {
            Logger.info(`${user.email} attempted change when booked slot time has already passed.`);
            return res.status(400).json({error: "Booked slot time has already passed."});
        }
        if ((oldSlot.startTime.getTime() - new Date().getTime()) < (9 * 60 * 60 * 1000)) {
            Logger.info(`${user.email} not allowed change slot since within 9 hours of booked slot time.`);
            return res.status(400).json({error: 
                "Slot change is not allowed within 9 hours of the already booked slot."});
        }

        oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter(
            (id) => id.toString() != (user._id).toString()
        );

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        const istnewDateTime = moment.tz(slot.startTime.getTime() - 10 * 60 * 1000, 'UTC').tz('Asia/Kolkata');
        const istnewDate = istnewDateTime.format('dddd, MMMM D, YYYY');
        const istnewTime = istnewDateTime.format('hh:mm:ss A');

        const qrmail = fs.readFileSync('/app/src/controllers/finalqr.html', 'utf8');
        let customQRMail = qrmail.replace('%backend_data%', user.QR.data);
        customQRMail = customQRMail.replace('%backend_date%', istnewDate);
        customQRMail = customQRMail.replace('%backend_time%', istnewTime);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: envHandler('MLRID'),
                pass: envHandler('MLRPASS')
            }
        });

        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Team CSI" <askcsivit@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "Slot Change Confirmation - CSI LaserTag", // Subject line
            html: customQRMail, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        //
        // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //       <https://github.com/forwardemail/preview-email>
        //
        }

        main().catch(console.error);

        await Promise.all([oldSlot.save(), slot.save(), user.save()]);

        Logger.info(`${user.email} successfully changed slot to ${slot.startTime}.`);
        return res.status(200).json({message: "Slot successfully changed."});
    }
);

export default ChangeSlotController;