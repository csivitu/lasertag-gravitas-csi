import winston from "winston";
import envHandler from "../helpers/envHandler.js";

const levels = {
    error: 0, 
    warn: 1,
    info: 2, 
    http: 3,
    debug: 4
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
    winston.format.colorize({all: true}),
    winston.format.align(),
    winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/combined.log'
    }),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'warn'
    }),
    new winston.transports.File({
        filename: 'logs/error_new.log',
        level: 'error'
    }),
];

const Logger = winston.createLogger({
    level: envHandler('LOG_LEVEL') || 'info',
    levels: levels,
    format: format,
    transports: transports
});

export default Logger;