import mongoose from "mongoose";
import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import Logger from "../initializers/logger.js";

const url = envHandler('DBURL');

const connectToDB = catchAsync(
    async () => {
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {console.log("Connected to Database!")})
        .catch((err) => {
            Logger.error("Unable to connect to Database: " + err);
        });
    }
);

export default connectToDB;