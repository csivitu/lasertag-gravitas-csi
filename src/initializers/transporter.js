import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: envHandler('MAILER'),
        pass: envHandler('MLRPASS')
    }
});

export default transporter;