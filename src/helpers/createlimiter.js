import { rateLimit } from "express-rate-limit";

const createLimiter = (limit, min) => {
    const limiter = rateLimit({
        windowMs: min * 60 * 1000,
        limit: limit,
        standardHeaders: 'draft-7',
        legacyHeaders: false
    });
    return limiter;
};

export default createLimiter;