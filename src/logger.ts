class Logger {
	showDebugs = false;
	showLogs = true;
	showInfos = true;
	showWarnings = true;
	showErrors = true;

	debug(...data: any[]) {
		if (this.showDebugs) console.debug(...['DEBUG -', ...data]);
	}

	log(...data: any[]) {
		if (this.showLogs) console.log(...['LOG -', ...data]);
	}

	info(...data: any[]) {
		if (this.showInfos) console.info(...['INFO -', ...data]);
	}

	warn(...data: any[]) {
		if (this.showWarnings) console.warn(...['WARN -', ...data]);
	}

	error(...data: any[]) {
		if (this.showErrors) console.error(...['ERROR -', ...data]);
	}

	clear() {
		console.clear();
	}
}

export const logger = new Logger();
