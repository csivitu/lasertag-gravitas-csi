import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import envHandler from "../helpers/envHandler.js";
import fs from "fs";

const SendMailController = catchAsync(
    async (req, res) => {
        let {password} = req.body;
        if (password != envHandler('SUPERADMIN_PASS')) {
            Logger.info('Wrong password entered for creating data');
            return res.status(400).json({error: "Bad auth: You are not allowed to create data."});
        }
        
        const users = await User.find({scope: "SUPERADMIN"});

        const html = fs.readFileSync('/app/src/controllers/jesus1.html', 'utf8');

        for (let user of users) {

            await fetch(envHandler('MAILER'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: user.email,
                    from: "Team CSI <Askcsivit@gmail.com>",
                    subject: "Slot Booking Notice for LaserTag",
                    html: html,
                    auth: envHandler('MLRPASS')
                })
            })
            .then((info) => {
                Logger.info(`${user.email} got the notice mail successfully: ${info}`);
            })
            .catch((err) => {
                Logger.error(`Mailer Error: ${err}: Unable to send mail for ${user.email} for notice mail.`);
            });
        }

        return res.status(200).json({message: "Sent mail successfully."});
    }
);

export default SendMailController;