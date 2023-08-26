const requireAdmin = catchAsync(
    async (req, res) => {
        const userID = req.userID;

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