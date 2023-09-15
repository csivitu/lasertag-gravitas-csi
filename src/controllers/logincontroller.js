import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import redis from "../initializers/redis.js";
import otpGenerator from "otp-generator";
import envHandler from "../helpers/envHandler.js";
import Logger from "../initializers/logger.js";

const LoginController = catchAsync(
    async (req, res) => {
        let {regno, email} = req.body;
        regno = regno.trim();
        email = email.trim();

        const user = await User.findOne({email: email});
        if (!user)
        {
            return res.status(400).json({error: "Invalid Email ID"});
        }

        const generatedOTP = otpGenerator.generate(4, {digits: true, upperCase: false, specialChars: false});
        console.log(`Generated OTP: ${generatedOTP}`); // For testing, will be removed

        const otpKey = `${user._id}:otp`;
        const attemptKey = `${user._id}:otpAttempts`;
        await redis.setex(otpKey, 300, generatedOTP);
        await redis.set(attemptKey, 0);

        await fetch(envHandler('MAILER'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: email,
                from: "Team CSI <Askcsivit@gmail.com>",
                subject: "OTP Verification - CSI Lasertag",
                text: `Your Generated OTP for LaserTag login is: ${generatedOTP}`,
                auth: envHandler('MLRPASS')
            })
        })
        .then((info) => {
            Logger.info(`${email} logged in successfully: ${info}`);
        })
        .catch((err) => {
            Logger.error(`Mailer Error: ${err}: Unable to send mail for ${email}.`);
            return res.status(500).json({error: "Unable to send Mail"});
        });

        return res.status(200).json({message: "OTP sent to your mail"});
    }
);

export default LoginController;