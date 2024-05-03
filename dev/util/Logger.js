export class Logger {
    constructor() {
        this.showDebugs = false;
        this.showLogs = true;
        this.showInfos = true;
        this.showWarnings = true;
        this.showErrors = true;
    }
    debug(...data) {
        if (this.showDebugs)
            console.debug(...['DEBUG -', ...data]);
    }
    log(...data) {
        if (this.showLogs)
            console.log(...['LOG -', ...data]);
    }
    info(...data) {
        if (this.showInfos)
            console.info(...['INFO -', ...data]);
    }
    warn(...data) {
        if (this.showWarnings)
            console.warn(...['WARN -', ...data]);
    }
    error(...data) {
        if (this.showErrors)
            console.error(...['ERROR -', ...data]);
    }
    clear() {
        console.clear();
    }
}
export default new Logger();
