import dotenv from "dotenv";
import Logger from "../initializers/logger.js";

dotenv.config({path: "./.env"});

const envHandler = (envName) => {
    const env = process.env[envName];
    if (!env)
    {
        Logger.error(`ENV ${envName} variable not defined.`);
    }
    return env;
};

export default envHandler;