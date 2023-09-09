import nodemailer from "nodemailer";
import envHandler from "../helpers/envHandler.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: envHandler('MAILER'),
        pass: envHandler('MLRPASS')
    }
});

export default transporter;