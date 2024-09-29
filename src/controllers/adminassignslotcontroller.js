import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";
import envHandler from "../helpers/envHandler.js";
import Logger from "../initializers/logger.js";

const AdminAssignSlotController = catchAsync(
    async (req, res) => {
        let { adminMail } = req.admin;
        let { email, slotId } = req.body;
        email = email.trim();
        email = email.toLowerCase();

        const user = await User.findOne({ email: email });

        if (!user) {
            Logger.info(`${email} is an invalid user email id for admin to cancel slot.`);
            return res.status(400).json({ error: "Invalid Email-ID entered." });
        }

        const slot = await Slot.findById(slotId);

        if (!slot) {
            Logger.info(`ADMIN ${adminMail} attempted to assign invalid slot.`);
            return res.status(400).json({ error: "Invalid Slot / Slot not Found" });
        }

        if (user.slotBooked != null) {
            const oldSlot = await Slot.findById(user.slotBooked);

            oldSlot.slotBookedBy = oldSlot.slotBookedBy.filter(
                (id) => id.toString() != (user._id).toString()
            );
            await oldSlot.save();
        }

        const linkText = `${envHandler('CLIENT_URL')}/admin-scan/${user.email}`;
        const iststartDateTime = moment.tz(slot.startTime.getTime() - 10 * 60 * 1000, 'UTC').tz('Asia/Kolkata');
        const iststartDate = iststartDateTime.format('dddd, MMMM D, YYYY');
        const iststartTime = iststartDateTime.format('hh:mm:ss A');

        const qrmail = fs.readFileSync('./src/controllers/finalqr_new.html', 'utf8');
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


        user.slotBooked = slot;
        slot.slotBookedBy.push(user);
        user.QR.isScanned = false;
        user.QR.data = linkText;

        await Promise.all([user.save(), slot.save()]);
        Logger.info(`ADMIN ${adminMail} assigned slot ${slot.startTime} to ${email}.`);
        return res.status(200).json({ message: `Successfully assigned slot ${slot.startTime} to ${email}.` });
    }
);

export default AdminAssignSlotController;
