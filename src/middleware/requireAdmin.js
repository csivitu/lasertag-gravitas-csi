import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";

const requireAdmin = catchAsync(
    async (req, res, next) => {
        const {userID} = req.userID;

        const user = await User.findOne({_id: userID});
        if (!user) {
            return res.status(400).json({error: "Invalid User ID"});
        }

        if (user.scope != "ADMIN") {
            return res.status(400).json({error: "User not authorized as ADMIN"});
        }

        req.admin = {adminMail: user.email};
        next();
    }
);

export default requireAdmin;