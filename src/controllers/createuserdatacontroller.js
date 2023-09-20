import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import XLSX from "xlsx";
import envHandler from "../helpers/envHandler.js";

const CreateUserDataController = catchAsync(
    async (req, res) => {

        const filepath = "/app/userdata.xlsx";
        const workbook = XLSX.readFile(filepath);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonUsers = XLSX.utils.sheet_to_json(worksheet);
        
        for (let user of jsonUsers) {
            let userName, userRegNo, userEmail, userPhone;
            userName = user.users_name.trim();
            if (user.registration_number) { 
                userRegNo = user.registration_number.trim();
            } else {userRegNo = null;}
            userEmail = user.users_email.trim().toLowerCase();
            userPhone = (user.users_phone.toString()).trim();
            
            let newUser = {
                name: userName,
                regno: userRegNo,
                email: userEmail,
                phoneno: userPhone
            };

            await User.create([newUser])
            .catch((err) => {
                Logger.error(`Error creating user: ${err}`);
                return res.status(500).json({error: `Error occurred when creating new user: ${err}`});
            })
        }

        await User.create([
            {
                name: "Anubhav Aryan",
                email: "anubhav.aryan2021@vitstudent.ac.in",
                scope: "SUPERADMIN"
            },
            {
                name: "Sourish Gupta",
                email: "sourishgupta02@gmail.com",
                scope: "SUPERADMIN"
            },
            {
                name: "Yug Oswal",
                email: "yoswal071@gmail.com",
                scope: "SUPERADMIN"
            },
            {
                name: "Manas Laud",
                email: "manasgaming126@gmail.com",
                scope: "SUPERADMIN"
            },
            {
                name: "I Love Goth",
                email: "kaushalrathi24@gmail.com",
                scope: "SUPERADMIN"
            },
            {
                name: "Alisha Bandyopadhyay",
                email: "alisha.bandyopadhyay2021@vitstudent.ac.in",
                scope: "SUPERADMIN"
            },
            {
                name: "Ansu Banerjee",
                email: "ansu.banerjee2022@vitstudent.ac.in",
                scope: "ADMIN"
            },
            {
                name: "Ojas Tapadia",
                email: "ojas.tapadia2022@vitstudent.ac.in",
                scope: "ADMIN"
            }
        ]);

        await User.findOneAndUpdate(
            {email: "brinda.dhingra2020@vitstudent.ac.in"},
            {$set: {scope: "SUPERADMIN"}}
        );

        return res.status(400).json({message: "User Data successfully created."});
    }
);

export default CreateUserDataController;