const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => {
        console.log(`Asynchronous Function Error: ${err}`);
        next(err);
    })
};

export default catchAsync;