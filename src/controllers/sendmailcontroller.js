import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import envHandler from "../helpers/envHandler.js";
import nodemailer from "nodemailer";
import fs from "fs";

const SendMailController = catchAsync(
    async (req, res) => {
        let {password} = req.body;
        if (password != envHandler('SUPERADMIN_PASS')) {
            Logger.info('Wrong password entered for creating data');
            return res.status(400).json({error: "Bad auth: You are not allowed to create data."});
        }
        
        const users = await User.find({scope: "SUPERADMIN"});

        const html = fs.readFileSync('/app/src/controllers/noqr.html', 'utf8');

        for (let user of users) {

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
                subject: "Slot Booking Notice for LaserTag", // Subject line
                html: html, // html body
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
        }
        return res.status(200).json({message: "Sent mail successfully."});
});

export default SendMailController;