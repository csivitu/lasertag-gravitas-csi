import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";

const CreateUserDataController = catchAsync(
    async (req, res) => {
        User.deleteMany({});
        User.create([
            {
                regno: "22BCE2700",
                phoneno: "7483555328",
                email: "yoswal99@gmail.com",
                scope: "SUPERADMIN"
            },
            {
                regno: "22BKT0060",
                email: "manaslaud@hotmail.com",
                scope: "ADMIN"
            },
            {
                email: "anubhav.aryan02@gmail.com"
            },
            {
                email: "ansu.banerjee2022@vitstudent.ac.in"
            },
            {
                email: "ojas.tapadia2022@vitstudent.ac.in"
            },
            {
                email: "aaryan.narang2022@vitstudent.ac.in"
            },
            {
                email: "sourishgupta02@gmail.com"
            },
            {
                email: "alishabandyopadhyay07@gmail.com"
            }
        ])
        .then((createdUser) => {
            console.log("User Created: " + createdUser);
        })
        .catch((err) => {
            console.log("Unable to create User: " + err);
        });

        Logger.info("Dummy data created.");
        return res.status(200).json({message: "Dummy data succesfully created."});
    }
);

export default CreateUserDataController;