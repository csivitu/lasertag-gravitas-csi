import Logger from "../initializers/logger.js";

const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => {
        Logger.error(`Asynchronous Function Error: ${err}`);
        next(err);
    })
};

export default catchAsync;