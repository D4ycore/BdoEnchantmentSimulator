import { DEBUG, ERROR, INFO, LOG, WARN } from './constants.js';

class Logger {
	debug(...data: any[]) {
		if (DEBUG) console.debug(...['DEBUG -', ...data]);
	}

	log(...data: any[]) {
		if (LOG) console.log(...['LOG -', ...data]);
	}

	info(...data: any[]) {
		if (INFO) console.info(...['INFO -', ...data]);
	}

	warn(...data: any[]) {
		if (WARN) console.warn(...['WARN -', ...data]);
	}

	error(...data: any[]) {
		if (ERROR) console.error(...['ERROR -', ...data]);
	}

	clear() {
		console.clear();
	}
}

export const logger = new Logger();
