import { DEBUG, ERROR, INFO, LOG, WARN } from './constants.js';
class Logger {
    debug(...data) {
        if (DEBUG)
            console.debug(...['DEBUG -', ...data]);
    }
    log(...data) {
        if (LOG)
            console.log(...['LOG -', ...data]);
    }
    info(...data) {
        if (INFO)
            console.info(...['INFO -', ...data]);
    }
    warn(...data) {
        if (WARN)
            console.warn(...['WARN -', ...data]);
    }
    error(...data) {
        if (ERROR)
            console.error(...['ERROR -', ...data]);
    }
    clear() {
        console.clear();
    }
}
export const logger = new Logger();
