import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import redis from "../initializers/redis.js";
import otpGenerator from "otp-generator";
import transporter from "../initializers/transporter.js";
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

        const mailOptions = {
            from: envHandler('MAILER'),
            to: email,
            subject: "OTP Verification",
            text: `Your OTP for Verification is: ${generatedOTP}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                Logger.error(`Error sending OTP mail: ${error}`);
                return res.status(500).json({error: "Failed to send OTP email"});
            }
            Logger.info(`OTP mail sent successfully to ${email}: ${info.response}`);
        });

        Logger.info(`${email} logged in successfully.`);
        return res.status(200).json({message: "OTP sent to your mail"});
    }
);

export default LoginController;