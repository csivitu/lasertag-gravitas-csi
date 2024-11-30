import createLimiter from "../helpers/createlimiter.js";

const msg = "yadfadaf";
const apilimiter = createLimiter(5, 2, msg);

export default apilimiter;
