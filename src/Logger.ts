import winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import Utils from './Utils';

export default class Logger {
	private static initWinston() {
		winston.clear().add(
			new WinstonDailyRotateFile({
				filename: 'logs/application-%DATE%.log',
				datePattern: 'YYYY-MM-DD-HH',
				zippedArchive: false,
				maxSize: '20m',
				maxFiles: '14d',
			}),
		);
	}
	private static handleUncaughtException() {
		process.on('uncaughtException', err => {
			Logger.err(err);
			process.exit(1);
		});
		process.on('unhandledRejection', err => {
			throw err;
		});
	}
	static init() {
		this.initWinston();
		this.handleUncaughtException();
	}
	static log(...arr: any[]) {
		arr.forEach(any => {
			console.log(any);
			winston.info(Utils.stringify(any));
		});
	}
	static err(...arr: any[]) {
		arr.forEach(any => {
            console.error(any);
			winston.error(Utils.stringify(any));
        });
	}
}
