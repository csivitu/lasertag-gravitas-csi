import createLimiter from "../helpers/createlimiter.js";

const changeslotlimiter = createLimiter(2, 24 * 60);

export default changeslotlimiter;