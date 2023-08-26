import catchAsync from "../helpers/catchAsync";
import User from "../models/userModel";

const VerifyUserController = catchAsync(
    async (req, res) => {
        let {email, otp} = req.body;

        const user = await User.findOne({email: email});
        if (!user || user.otp != otp) {
            return res.status(400).json({error: "Invalid Email ID or OTP"});
        }

        const token = jwt.sign({userID: user._id}, envHandler('JWTSecret'), {expiresIn: '12h'});
        return res.json({token});
    }
);

export default VerifyUserController;