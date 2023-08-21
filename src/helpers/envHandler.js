import dotenv from "dotenv";

dotenv.config({path: "../.env"})

const envHandler = (envName) => {
    const env = process.env.envName;
    if (!env)
    {
        console.error(`ENV ${envName} variable not defined.`);
    }
    return env;
};

export default envHandler;