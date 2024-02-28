import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import Slot from "../models/slotModel.js";
import XLSX from "xlsx";
import envHandler from "../helpers/envHandler.js";
import fs from "fs";
// import { userEmailsDay2 } from "./useremailsday2.js";

const CreateUserDataController = catchAsync(
    async (req, res) => {

        // console.log(userEmailsDay2.length);
        let {password} = req.body;
        if (password != envHandler('SUPERADMIN_PASS')) {
            Logger.info('Wrong password entered for creating data');
            return res.status(400).json({error: "Bad auth: You are not allowed to create data."});
        }

        // const filepath = "/app/userdata.xlsx";
        // const workbook = XLSX.readFile(filepath);

        // const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // const jsonUsers = XLSX.utils.sheet_to_json(worksheet);
        
        // for (let user of jsonUsers) {
        //     let userName, userRegNo, userEmail, userPhone;
        //     userName = (user['Student Name']).trim();
        //     if (user['Register Number']) { 
        //         userRegNo = (user['Register Number']).trim();
        //     } else {userRegNo = null;}
        //     userEmail = (user['EmailId']).trim().toLowerCase();
        //     userPhone = ((user['MobileNo.']).toString()).trim();
            
        //     let newUser = {
        //         name: userName,
        //         regno: userRegNo,
        //         email: userEmail,
        //         phoneno: userPhone
        //     };

        //     await User.create([newUser])
        //     .catch((err) => {
        //         Logger.error(`Error creating user: ${err}`);
        //         return res.status(500).json({error: `Error occurred when creating new user: ${err}`});
        //     })
        // }

        await User.create([
            // {
            //     name: "Saarim",
            //     email: "saarimmw@gmail.com"
            // },
            // {
            //     name: "Vibhor",
            //     email: "vibhor.agrawal2022@vitstudent.ac.in"
            // }
            
        ]);

        // await User.create([
        //     {
        //         name: "Anubhav Aryan",
        //         email: "anubhav.aryan2021@vitstudent.ac.in",
        //         scope: "SUPERADMIN"
        //     },
        //     {
        //         name: "Sourish Gupta",
        //         email: "sourishgupta02@gmail.com",
        //         scope: "SUPERADMIN"
        //     },
        //     {
        //         name: "Yug Oswal",
        //         email: "yoswal071@gmail.com",
        //         scope: "SUPERADMIN"
        //     },
        //     {
        //         name: "Manas Laud",
        //         email: "manasgaming126@gmail.com",
        //         scope: "SUPERADMIN"
        //     },
        //     {
        //         name: "I Love Goth",
        //         email: "kaushalrathi24@gmail.com",
        //         scope: "SUPERADMIN"
        //     },
        //     {
        //         name: "Alisha Bandyopadhyay",
        //         email: "alisha.bandyopadhyay2021@vitstudent.ac.in",
        //         scope: "SUPERADMIN"
        //     },
        //     {
        //         name: "Ansu Banerjee",
        //         email: "ansu.banerjee2022@vitstudent.ac.in",
        //         scope: "ADMIN"
        //     },
        //     {
        //         name: "Ojas Tapadia",
        //         email: "ojas.tapadia2022@vitstudent.ac.in",
        //         scope: "ADMIN"
        //     }
        // ]);

        // await User.findOneAndUpdate(
        //     {email: "brinda.dhingra2020@vitstudent.ac.in"},
        //     {$set: {scope: "SUPERADMIN"}}
        // );

        return res.status(400).json({message: "User Data successfully created."});

    //     const slots = await Slot.find({day: 3, isCarry: false})
    //     .populate("slotBookedBy");

    //     console.log(slots[0]);

    //     const users = slots.map((slot) => {
    //         const userObjs = slot.slotBookedBy;
    //         const userEmails = userObjs.map((user) => user.email);
    //         return userEmails;
    //     });

    //     let finalList = [];
    //     for (let mailList of users) {
    //         for (let mail of mailList) {
    //             finalList.push(mail);
    //         }
    //     }

    //     console.log(finalList.length);

    //     finalList = JSON.stringify(finalList, null, 2);
    //     fs.writeFileSync('useremailsday1.json', finalList);
    //     res.download('useremailsday1.json');

    //     // const batchSize = 14;
    //     // const emailsPerSecond = 14;
    //     // const delayBetweenBatches = 1000;

    //     // async function sendEmailBatch(emailBatch) {
    //     //     const promises = emailBatch.map((email) => {
    //     //       const params = {
    //     //         Source: 'Team CSI <askcsivit@gmail.com>', // Replace with your sender email
    //     //         Destination: {
    //     //           ToAddresses: [email],
    //     //         },
    //     //         Message: {
    //     //           Subject: {
    //     //             Data: 'Slot Change Notice for LaserTag - CSI',
    //     //           },
    //     //           Body: {
    //     //             Html: {
    //     //               Data: html,
    //     //             },
    //     //           },
    //     //         },
    //     //       };
          
    //     //       return ses.sendEmail(params).promise()
    //     //         .then(() => {
    //     //           console.log(`Email sent to: ${email}`);
    //     //         })
    //     //         .catch((err) => {
    //     //           console.error(`Error sending email to ${email}: ${err.message}`);
    //     //         });
    //     //     });

    //     //     await Promise.all(promises);
    //     // };

    //     // async function sendBulkEmails() {
    //     //     while (emailList.length > 0) {
    //     //       const emailBatch = emailList.splice(0, batchSize);
    //     //       await sendEmailBatch(emailBatch);
          
    //     //       if (emailList.length > 0) {
    //     //         // Introduce a delay between batches to stay within the SES rate limit
    //     //         await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
    //     //       }
    //     //     }
          
    //     //     console.log('All emails sent successfully');
    //     // }

    //     // sendBulkEmails()
    //     // .catch((err) => console.error(`Error sending bulk emails: ${err}`));

    //     // return res.status(400).json({message: "User Data successfully collected and slots assigned."});
    }
);

export default CreateUserDataController;