const crypto = require('crypto');
const jwtsecret = crypto.randomBytes(32).toString('hex');
console.log(jwtsecret);