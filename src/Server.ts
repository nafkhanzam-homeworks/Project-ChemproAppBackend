import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import apiv1 from './api/api-v1';
import ApiError from "./api/ApiError";
import AppMode from './AppMode';
import Config from './Config';
import { UserRole, getUserFromToken } from './database/schemas/user';
import Logger from './Logger';

export default class Server {
	private readonly app: express.Express;
	constructor() {
		this.app = express();
		this.app.disable('x-powered-by');
		this.app.use(express.json());
		this.app.use(cors());
		this.app.use(cookieParser());
		this.app.use(async (req, res, next) => { // NOTE: is this considered ugly?
			const token = req.headers[Config.TOKEN_HEADER];
			if (typeof token === 'string')
				res.locals.user = await getUserFromToken(token);
			res.locals.role = UserRole.GUEST;
			if (res.locals.user && typeof res.locals.user.role === 'number')
				res.locals.role = UserRole[res.locals.user.role as keyof typeof UserRole];
			next();
		});
        this.app.use('/api/v1', apiv1);

        this.app.use(((err, _req, res, next) => {
			if (!err)
				err = ApiError.DEFAULT;
			if (err instanceof ApiError)
				res.status(err.statusCode).send(err.message);
			else
				res.status(500).send(err);
			next();
        }) as express.ErrorRequestHandler);
	}
	async start() {
		await this.startDBConnection();
		this.startServerConnection();
	}
	private async startServerConnection() {
		await this.app.listen(Config.PORT);
		Logger.log(
			`Listening to port ${Config.PORT} on ${AppMode[Config.MODE].toLowerCase()} mode!`,
		);
	}
	private async startDBConnection() {
		await mongoose.connect(Config.DB, { useNewUrlParser: true, useCreateIndex: true });
		Logger.log(`Connected to MongoDB server!`);
	}
}
