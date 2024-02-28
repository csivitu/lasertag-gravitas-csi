import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import ses from "../initializers/sesmailer.js";
import moment from "moment-timezone";
import fs from "fs";

const BookSlotController = catchAsync(
    async (req, res) => {
        // return res.status(200).json({message: "Slot booking has now been officialy closed. Thank you for your participation!"});
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

        const params = {
            Source: 'Team CSI <askcsivit@gmail.com>', // Replace with your sender email
            Destination: {
              ToAddresses: [user.email],
            },
            Message: {
              Subject: {
                Data: 'Slot Booking Confirmation - CSI LaserTag',
              },
              Body: {
                Html: {
                  Data: customQRMail,
                },
              },
            },
        };
      
        await ses.sendEmail(params).promise()
        .then(() => {
            Logger.info(`Slot booking confirmation email sent to: ${user.email}`);
        })
        .catch((err) => {
            Logger.error(`Error sending slot booked email to ${user.email}: ${err.message}`);
        });

        slot.slotBookedBy.push(user);
        user.slotBooked = slot;
        user.QR.data = linkText;
        await Promise.all([slot.save(), user.save()]);
        Logger.info(`${user.email} successfully booked slot for ${slot.startTime}`);

        return res.status(200).json({message: "Slot successfully booked."});
    }
);

export default BookSlotController;