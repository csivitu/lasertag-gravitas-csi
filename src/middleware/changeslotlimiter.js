import createLimiter from "../helpers/createlimiter.js";

// const msg = "Cannot change slot more than twice in a day. Please try again later.";
const msg = "Cannot change slot more than 5 times in a day. Please try again later.";
const changeslotlimiter = createLimiter(5, 24 * 60, msg);

export default changeslotlimiter;
