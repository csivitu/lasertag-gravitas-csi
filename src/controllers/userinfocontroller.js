import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import User from "../models/userModel.js";

const UserInfoController = catchAsync(
    async (req, res) => {
        const {userID} = req.userID;

        const user = await User.findOne({_id: userID}).populate("slotBooked")
        .catch((err) => {
            Logger.error(`Get User Info error (Retrieving info from DB): ${err}`);
            return res.status(500).json({error: "Error retrieving User Info"});
        });

        Logger.info(`${user.email} retrieved user info.`);
        return res.status(200).json(user);
    }
);

export default UserInfoController;