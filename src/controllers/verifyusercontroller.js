import jwt from "jsonwebtoken";
import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import User from "../models/userModel.js";

const VerifyUserController = catchAsync(
    async (req, res) => {
        let {email, otp} = req.body;

        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({error: "Invalid Email ID"});
        }

        if (user.otpAttempts >= envHandler('MAXOTPATTEMPTS')) {
            return res.status(400).json({error: 
                `OTP verification attempts exceeded ${envHandler('MAXOTPATTEMPTS')}. Please login again.`});
        }

        if (user.otp != otp) {
            user.otpAttempts += 1;
            return res.status(400).json({error: "Invalid OTP."});
        }

        user.otpAttempts = 0;
        const token = jwt.sign({userID: user._id}, envHandler('JWTSecret'), {expiresIn: '12h'});
        return res.json({token});
    }
);

export default VerifyUserController;