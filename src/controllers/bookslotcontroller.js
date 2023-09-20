import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import { generateQR } from "../helpers/generateQR.js";
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
        const qrElement = await generateQR(linkText);
        const iststartDateTime = moment.tz(slot.startTime.getTime() - 10 * 60 * 1000, 'UTC').tz('Asia/Kolkata');
        const iststartDate = iststartDateTime.format('dddd, MMMM D, YYYY');
        const iststartTime = iststartDateTime.format('hh:mm:ss A');

        const qrmail = fs.readFileSync('/app/src/controllers/finalqr.html', 'utf8');
        let customQRMail = qrmail.replace('%backend_data%', linkText);
        customQRMail = customQRMail.replace('%backend_date%', iststartDate);
        customQRMail = customQRMail.replace('%backend_time%', iststartTime);

        await fetch(envHandler('MAILER'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: user.email,
                from: "Team CSI <Askcsivit@gmail.com>",
                subject: "Slot Booking Confirmation",
                html: customQRMail,
                auth: envHandler('MLRPASS')
            })
        })
        .then((info) => {
            Logger.info(`${user.email} booked slot successfully: ${info}`);
        })
        .catch((err) => {
            Logger.error(`Mailer Error: ${err}: Unable to send mail for ${user.email} for slot booking.`);
            return res.status(500).json({error: "Unable to send Mail"});
        });

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        user.QR.data = linkText;
        await Promise.all([slot.save(), user.save()]);

        return res.status(200).json({message: "Slot successfully booked."});
    }
);

export default BookSlotController;