import winston, {format} from "winston";

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});


const logger = winston.createLogger({ //You create a logger.
  level: 'info',  //The level: 'info' means: log messages from info and all more serious levels (warn, error, etc.). Lower levels like debug or silly will be ignored.
  
  //format: winston.format.json(), //The log messages will be stored in JSON format. That’s useful for structured logs which tools can read.
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  
  defaultMeta: { service: 'user-service' }, //Adds extra info (metadata) to every log. You’re tagging every log as coming from 'user-service'.


  transports: [ //Transports define where the logs go (file, console, cloud, etc.)
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //All logs of level 'error' (and higher like 'fatal') will go into a file named error.log.
    //Lower levels like 'info', 'warn' won't go here.
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
 export default logger;



 /*
 Logging Levels in Winston (default):

| Level   | Meaning                           |
| ------- | --------------------------------- |
| error   | Serious issue, need fixing        |
| warn    | Not an error, but potential issue |
| info    | General useful information        |
| http    | HTTP-specific logs (if used)      |
| verbose | More detailed info                |
| debug   | Debugging data                    |
| silly   | Everything, most detailed         |

Only levels equal or higher in priority than the logger.level will be logged.

 */