import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import XLSX from "xlsx";

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

        return res.status(400).json({message: "User Data successfully created."});
    }
);

export default CreateUserDataController;