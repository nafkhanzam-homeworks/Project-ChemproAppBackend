import winston from "winston";
import WinstonDailyRotateFile from "winston-daily-rotate-file";
import Utils from "./Utils";

export default class Logger {
	public static init() {
		winston.clear().add(
			new WinstonDailyRotateFile({
				datePattern: "YYYY-MM-DD-HH",
				filename: "logs/application-%DATE%.log",
				maxFiles: "14d",
				maxSize: "20m",
				zippedArchive: false,
			}),
		);
	}
	public static log(...arr: any[]) {
		arr.forEach((any) => {
			console.log(any);
			winston.info(Utils.stringify(any));
		});
	}
	public static err(...arr: any[]) {
		arr.forEach((any) => {
            console.error(any);
			winston.error(Utils.stringify(any));
        });
	}
}
