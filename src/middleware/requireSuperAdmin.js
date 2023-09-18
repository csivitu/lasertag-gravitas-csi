import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";

const requireSuperAdmin = catchAsync(
    async (req, res, next) => {
        const {userID} = req.userID;

        const user = await User.findById(userID);

        if (user.scope != "SUPERADMIN") {
            return res.status(400).json({error: "User not authorized as SUPER ADMIN"});
        }

        req.admin = {adminMail: user.email};
        next();
    }
);

export default requireSuperAdmin;