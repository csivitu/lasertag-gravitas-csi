import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import redis from "../initializers/redis.js";
import otpGenerator from "otp-generator";
import ses from "../initializers/sesmailer.js";
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

        const params = {
            Source: 'Team CSI <askcsivit@gmail.com>', // Replace with your sender email
            Destination: {
              ToAddresses: [user.email],
            },
            Message: {
              Subject: {
                Data: 'OTP Verification - CSI LaserTag',
              },
              Body: {
                Text: {
                  Data: `Your Generated OTP for LaserTag login is:\n${generatedOTP}`,
                },
              },
            },
        };
      
        await ses.sendEmail(params).promise()
        .then(() => {
            Logger.info(`OTP Verification email sent to: ${email}`);
        })
        .catch((err) => {
            Logger.error(`Error sending otp verification email to ${email}: ${err.message}`);
        });

        await user.save();
        return res.status(200).json({message: "OTP sent to your mail"});
    }
);

export default LoginController;