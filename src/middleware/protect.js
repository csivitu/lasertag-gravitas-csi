import catchAsync from "../helpers/catchAsync.js";
import { envHandler } from "../helpers/envHandler.js"
import { jwtVerifyPromisified } from "../helpers/jwtFuncs.js";

const protect = catchAsync(
    async (req, res, next) => {
        let authorizationHeader = req.headers.authorization;
        let token;
        if (authorizationHeader &&
            authorizationHeader.startswith('Bearer'))
            token = authorizationHeader.split(' ')[1];

        if (!token)
            return res.status(400).json({ error: 'User ID must be alphanumeric', verified: false });

        const decoded = await jwtVerifyPromisified(token, envHandler('JWTSecret'))
            .catch((err) => {
                return res.status(400).json({
                    error: err.message,
                    verified: false
                });
            });

        req.userID = decoded;
        next();
    }
);

export default protect;