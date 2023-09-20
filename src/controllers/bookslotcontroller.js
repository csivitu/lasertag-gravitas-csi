import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import { generateQR } from "../helpers/generateQR.js";
import nodemailer from "nodemailer";
import moment from "moment-timezone";
import fs from "fs";

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

        const linkText = `${envHandler('CLIENT_URL')}admin-scan/${user.email}`;
        const iststartDateTime = moment.tz(slot.startTime.getTime() - 10 * 60 * 1000, 'UTC').tz('Asia/Kolkata');
        const iststartDate = iststartDateTime.format('dddd, MMMM D, YYYY');
        const iststartTime = iststartDateTime.format('hh:mm:ss A');

        const qrmail = fs.readFileSync('/app/src/controllers/finalqr.html', 'utf8');
        let customQRMail = qrmail.replace('%backend_data%', linkText);
        customQRMail = customQRMail.replace('%backend_date%', iststartDate);
        customQRMail = customQRMail.replace('%backend_time%', iststartTime);

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
            subject: "Slot Booking Confirmation - CSI Lasertag", // Subject line
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

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        user.QR.data = linkText;
        await Promise.all([slot.save(), user.save()]);

        return res.status(200).json({message: "Slot successfully booked."});
    }
);

export default BookSlotController;