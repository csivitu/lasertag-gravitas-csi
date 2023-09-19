import createLimiter from "../helpers/createlimiter.js";

const msg = "Too many requests. Request limit exceeded. Please do not deliberately send requests for no reason.";
const apilimiter = createLimiter(100, 15, msg);

export default apilimiter;