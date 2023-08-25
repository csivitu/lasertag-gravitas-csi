import catchAsync from "../helpers/catchAsync";
import User from "../models/userModel";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

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

        user.otp = generatedOTP;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "your-email@some.com",
                pass: "some-password"
            }
        });

        const mailOptions = {
            from: "your-email@some.com",
            to: email,
            subject: "OTP Verification",
            text: `Your OTP for Verification is: ${generatedOTP}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({error: "Failed to send OTP email"});
            }
            console.log("Email sent: " + info.response);
            return res.status(200).json({message: "OTP sent to your mail"});
        });
    }
);

export default LoginController;