import createLimiter from "../helpers/createlimiter.js";

const apilimiter = createLimiter(100, 15);

export default apilimiter;