import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import envHandler from "../helpers/envHandler.js";
import ses from "../initializers/sesmailer.js";
import fs from "fs";

const SendMailController = catchAsync(
    async (req, res) => {
        let {password} = req.body;
        if (password != envHandler('SUPERADMIN_PASS')) {
            Logger.info('Wrong password entered for creating data');
            return res.status(400).json({error: "Bad auth: You are not allowed to create data."});
        }

        const html = fs.readFileSync('/app/src/controllers/noqr.html', 'utf8');

        const users = await User.find({scope: "SUPERADMIN"}, 'email').lean().exec(); // To be changed to all users
        const emailList = users.map((user) => user.email);
        console.log(emailList);
        console.log(emailList.length);

        const batchSize = 14;
        const emailsPerSecond = 14;
        const delayBetweenBatches = 1000;

        async function sendEmailBatch(emailBatch) {
            const promises = emailBatch.map((email) => {
              const params = {
                Source: 'Team CSI <askcsivit@gmail.com>', // Replace with your sender email
                Destination: {
                  ToAddresses: [email],
                },
                Message: {
                  Subject: {
                    Data: 'Slot Booking Notice for LaserTag - CSI',
                  },
                  Body: {
                    Html: {
                      Data: html,
                    },
                  },
                },
              };
          
              return ses.sendEmail(params).promise()
                .then(() => {
                  console.log(`Email sent to: ${email}`);
                })
                .catch((err) => {
                  console.error(`Error sending email to ${email}: ${err.message}`);
                });
            });

            await Promise.all(promises);
        };

        async function sendBulkEmails() {
            while (emailList.length > 0) {
              const emailBatch = emailList.splice(0, batchSize);
              await sendEmailBatch(emailBatch);
          
              if (emailList.length > 0) {
                // Introduce a delay between batches to stay within the SES rate limit
                await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
              }
            }
          
            console.log('All emails sent successfully');
        }

        sendBulkEmails()
        .catch((err) => console.error(`Error sending bulk emails: ${err}`));

        return res.status(200).json({message: "Sent mail successfully."});
});

export default SendMailController;