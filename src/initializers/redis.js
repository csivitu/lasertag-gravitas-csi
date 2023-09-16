import Redis from "ioredis";
import Logger from "./logger.js";

const redis = new Redis({
    host: 'redis',
    port: 6379
});

Logger.log("Connected to Redis!");

export default redis;