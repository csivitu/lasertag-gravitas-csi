import AWS from "aws-sdk";
import envHandler from "../helpers/envHandler.js";

const SES_CONFIG = {
    accessKeyId: envHandler('ACCESSKEY'),
    secretAccessKey: envHandler('SECRETKEY'),
    region: 'ap-south-1',
};

const ses = new AWS.SES(SES_CONFIG);

export default ses;