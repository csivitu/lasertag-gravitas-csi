import User from "../models/userModel.js";

const requireAdmin = catchAsync(
    async (req, res, next) => {
        const userID = req.userID.userID;

        const user = await User.findOne({_id: userID});
        if (!user) {
            return res.status(400).json({error: "Invalid User ID"});
        }

        if (user.scope != "ADMIN") {
            return res.status(400).json({error: "User not authorized as ADMIN"});
        }

        next();
    }
);

export default requireAdmin;