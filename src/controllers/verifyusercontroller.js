import jwt from "jsonwebtoken";
import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import User from "../models/userModel.js";
import redis from "../initializers/redis.js";
import Logger from "../initializers/logger.js";

const VerifyUserController = catchAsync(
    async (req, res) => {
        let {email, otp} = req.body;

        const user = await User.findOne({email: email});
        if (!user) {
            Logger.info(`Invalid mail id: ${email}`);
            return res.status(400).json({error: "Invalid Email ID"});
        }

        const otpKey = `${user._id}:otp`;
        const otpStatus = await redis.exists(otpKey);

        if (otpStatus == 0) {
            Logger.info(`OTP has expired for ${email}`);
            return res.status(400).json({error: 
                "OTP validity has expired, or has not been generated. Please login."});
        }

        const attemptKey = `${user._id}:otpAttempts`;
        const attempts = await redis.get(attemptKey);

        if (attempts >= envHandler('MAXOTPATTEMPTS')) {
            Logger.info(`${email} exceeded max OTP attempts.`);
            await redis.del(otpKey);
            return res.status(400).json({error: "Maximum OTP tries exceeded. Please login again."});
        }

        const gtdotp = await redis.get(otpKey);

        if (gtdotp != otp) {
            Logger.info(`${email} entered an invalid OTP.`);
            await redis.incr(attemptKey);
            return res.status(400).json({error: "Invalid OTP entered. Please try again."});
        }

        redis.set(attemptKey, 0);
        const token = jwt.sign({userID: user._id}, envHandler('JWTSecret'), {expiresIn: '12h'});
        if (user.scope == "ADMIN" || user.scope == "SUPERADMIN") {
            Logger.info(`${email} successfully verified and logged in as ADMIN.`);
            return res.json({token, isAdmin: true});
        }
        Logger.info(`${email} successfully verified and logged in as USER.`);
        await redis.del(attemptKey)
        return res.json({token, isAdmin: false});
    }
);

export default VerifyUserController;