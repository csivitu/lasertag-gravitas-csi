import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import User from "../models/userModel.js";
import moment from "moment-timezone";

const UserInfoController = catchAsync(
    async (req, res) => {
        const {userID} = req.userID;

        const user = await User.findOne({_id: userID}).populate("slotBooked")
        .catch((err) => {
            Logger.error(`Get User Info error (Retrieving info from DB): ${err}`);
            return res.status(500).json({error: "Error retrieving User Info"});
        });

        Logger.info(`${user.email} retrieved user info.`);

        let adjustedUser;
        if (user.slotBooked != null) {
            const adjustedStartTime = moment.tz(user.slotBooked.startTime.getTime() - 10 * 60 * 1000, 'UTC');
            const adjustedEndTime = moment.tz(user.slotBooked.endTime.getTime() - 10 * 60 * 1000, 'UTC');
            adjustedUser = {
                ...user.toObject(),
                slotBooked: {
                    ...user.slotBooked.toObject(),
                    startTime: adjustedStartTime,
                    endTime: adjustedEndTime
                }
            };
        } else {
            adjustedUser = user;
        }

        return res.status(200).json(adjustedUser);
    }
);

export default UserInfoController;