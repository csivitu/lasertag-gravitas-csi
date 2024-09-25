import createLimiter from "../helpers/createlimiter.js";

const msg = "Cannot change slot more than twice in a day. Please try again later.";
// const changeslotlimiter = createLimiter(2, 24 * 60, msg);
const changeslotlimiter = createLimiter(2, 1, msg);

export default changeslotlimiter;
