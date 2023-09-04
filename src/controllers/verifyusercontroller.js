import jwt from "jsonwebtoken";
import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import User from "../models/userModel.js";
import redis from "../initializers/redis.js";

const VerifyUserController = catchAsync(
    async (req, res) => {
        let {email, otp} = req.body;

        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({error: "Invalid Email ID"});
        }

        const otpKey = `${user._id}:otp`;
        const otpStatus = await redis.exists(otpKey);

        if (otpStatus == 0) {
            return res.status(400).json({error: 
                "OTP validity has expired, or has not been generated. Please login."});
        }

        const attemptKey = `${user._id}:otpAttempts`;
        const attempts = await redis.get(attemptKey);

        if (attempts >= envHandler('MAXOTPATTEMPTS')) {
            return res.status(400).json({error: "Maximum OTP tries exceeded. Please login again."});
        }

        const gtdotp = await redis.get(otpKey);

        if (gtdotp != otp) {
            await redis.incr(attemptKey);
            return res.status(400).json({error: "Invalid OTP entered. Please try again."});
        }

        redis.set(attemptKey, 0);
        const token = jwt.sign({userID: user._id}, envHandler('JWTSecret'), {expiresIn: '12h'});
        if (user.scope == "ADMIN") {
            return res.json({token, isAdmin: true});
        }
        return res.json({token, isAdmin: false});
    }
);

export default VerifyUserController;