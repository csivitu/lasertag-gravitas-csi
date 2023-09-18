import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";

const requireNotScanned = catchAsync(
    async (req, res, next) => {
        const {userID} = req.userID;

        const user = await User.findOne({_id: userID});
        if (!user) {
            return res.status(400).json({error: "Invalid User ID"});
        }

        if (user.QR.isScanned) {
            return res.status(400).json({error: "User has already scanned QR"});
        }
        next();
    }
);

export default requireNotScanned;