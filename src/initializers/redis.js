import Redis from "ioredis";

const redis = new Redis({
    host: 'redis',
    port: 6379
});

console.log("Connected to Redis!");

export default redis;