import catchAsync from "../helpers/catchAsync.js";
import User from "../models/userModel.js";
import Logger from "../initializers/logger.js";
import Slot from "../models/slotModel.js";
import XLSX from "xlsx";
import envHandler from "../helpers/envHandler.js";
import fs from "fs";
import { userEmailsDay2 } from "./useremailsday2.js";

const CreateUserDataController = catchAsync(
    async (req, res) => {

        console.log(userEmailsDay2.length);
        let {password} = req.body;
        if (password != envHandler('SUPERADMIN_PASS')) {
            Logger.info('Wrong password entered for creating data');
            return res.status(400).json({error: "Bad auth: You are not allowed to create data."});
        }

        const slots = await Slot.find({day: 3, isCarry: false})
        .populate("slotBookedBy");

        console.log(slots[0]);

        const users = slots.map((slot) => {
            const userObjs = slot.slotBookedBy;
            const userEmails = userObjs.map((user) => user.email);
            return userEmails;
        });

        let finalList = [];
        for (let mailList of users) {
            for (let mail of mailList) {
                finalList.push(mail);
            }
        }

        console.log(finalList.length);

        finalList = JSON.stringify(finalList, null, 2);
        fs.writeFileSync('useremailsday1.json', finalList);
        res.download('useremailsday1.json');

        // const batchSize = 14;
        // const emailsPerSecond = 14;
        // const delayBetweenBatches = 1000;

        // async function sendEmailBatch(emailBatch) {
        //     const promises = emailBatch.map((email) => {
        //       const params = {
        //         Source: 'Team CSI <askcsivit@gmail.com>', // Replace with your sender email
        //         Destination: {
        //           ToAddresses: [email],
        //         },
        //         Message: {
        //           Subject: {
        //             Data: 'Slot Change Notice for LaserTag - CSI',
        //           },
        //           Body: {
        //             Html: {
        //               Data: html,
        //             },
        //           },
        //         },
        //       };
          
        //       return ses.sendEmail(params).promise()
        //         .then(() => {
        //           console.log(`Email sent to: ${email}`);
        //         })
        //         .catch((err) => {
        //           console.error(`Error sending email to ${email}: ${err.message}`);
        //         });
        //     });

        //     await Promise.all(promises);
        // };

        // async function sendBulkEmails() {
        //     while (emailList.length > 0) {
        //       const emailBatch = emailList.splice(0, batchSize);
        //       await sendEmailBatch(emailBatch);
          
        //       if (emailList.length > 0) {
        //         // Introduce a delay between batches to stay within the SES rate limit
        //         await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
        //       }
        //     }
          
        //     console.log('All emails sent successfully');
        // }

        // sendBulkEmails()
        // .catch((err) => console.error(`Error sending bulk emails: ${err}`));

        // return res.status(400).json({message: "User Data successfully collected and slots assigned."});
    }
);

export default CreateUserDataController;