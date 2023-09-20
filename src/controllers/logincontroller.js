import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import redis from "../initializers/redis.js";
import otpGenerator from "otp-generator";
import envHandler from "../helpers/envHandler.js";
import nodemailer from "nodemailer";
import Logger from "../initializers/logger.js";

const LoginController = catchAsync(
    async (req, res) => {
        let {email} = req.body;
        email = email.trim();
        email = email.toLowerCase();

        const user = await User.findOne({email: email});
        if (!user)
        {
            return res.status(400).json({error: "Invalid Email ID"});
        }

        const generatedOTP = otpGenerator.generate(6, {digits: true, upperCase: false, specialChars: false});

        const otpKey = `${user._id}:otp`;
        const attemptKey = `${user._id}:otpAttempts`;
        await redis.setex(otpKey, 300, generatedOTP);
        await redis.set(attemptKey, 0);

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
            subject: "OTP Verification - CSI LaserTag", // Subject line
            text: `Your generated OTP for LaserTag login is: ${generatedOTP}`
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

        await user.save();
        return res.status(200).json({message: "OTP sent to your mail"});
    }
);

export default LoginController;