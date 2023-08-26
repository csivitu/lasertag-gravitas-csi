import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";

const UserInfoController = catchAsync(
    async (req, res) => {
        const userID = req.userID;

        const user = await User.findOne({_id: userID}).populate("slotBooked")
        .catch((err) => {
            console.log("Error retrieving User Info (from DB): " + err.message);
            return res.status(500).json({error: "Error retrieving User Info"});
        });

        return res.status(200).json({regno: user.regno, email: user.email, slotBooked: user.slotBooked});
    }
);

export default UserInfoController;