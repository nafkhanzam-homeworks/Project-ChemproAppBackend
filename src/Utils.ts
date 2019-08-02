import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import safeJsonStringify from "safe-json-stringify";
import serializeError from "serialize-error";
import ApiError from "./ApiError";
import Config from "./Config";

export default class Utils {
	public static stringify(obj: any): string {
		if (obj instanceof Error)
			return safeJsonStringify(serializeError(obj));
		return safeJsonStringify(obj);
	}
	public static async resolve(promise: Promise<any>): Promise<[any, any]> {
		let result = null;
		let error = null;
		try {
			result = await promise;
		} catch (err) {
			// console.log("ERROR STARTS HERE:::++++++++++++++++++");
			// console.log(serializeError(err));
			// console.log("ERROR ENDS HERE:::++++++++++++++++++");
			error = err;
		}
		return [error, result];
	}
	public static generateToken(id: string, rememberMe: boolean) {
		return jwt.sign({ id }, Config.TOKEN_PASSKEY, { expiresIn: rememberMe ? Config.TOKEN_EXPIRES_LONGER : Config.TOKEN_EXPIRES });
	}
	public static async bcryptHash(password: string): Promise<string> {
		return await bcrypt.hash(password, 10);
	}
	public static getErrorMessage(error: any) {
		return error.response ?
			error.response.data ?
			error.response.data.formattedMessage ?
				error.response.data.formattedMessage
			: error.response.data
			: error.response.statusText ?
			error.response.statusText
			: error.response
		: error.message ?
			error.message
		: error;
	}
	public static crud = <T extends mongoose.Document>(Model: mongoose.Model<T>) => ({
		getAll: async (props?: any): Promise<T[]> => {
			return await Model.find({}, props).exec();
		},
		get: async (id: string, props?: any): Promise<T> => {
			const doc = await Model.findById(id, props).exec();
			if (!doc)
				throw ApiError.NOT_FOUND;
			return doc;
		},
		post: async (body: any): Promise<T> => {
			const [err, res] = await Utils.resolve(Model.create(body));
			if (err)
				throw ApiError.BAD_REQUEST;
			return res;
		},
		put: async (id: string, body: any): Promise<T> => {
			const doc = await Model.findById(id).exec();
			if (!doc)
				throw ApiError.NOT_FOUND;
			const [err, res] = await Utils.resolve(doc.update(body).exec());
			if (err)
				throw ApiError.BAD_REQUEST;
			return res;
		},
		delete: async (id: string): Promise<T> => {
			const doc = await Model.findById(id).exec();
			if (!doc)
				throw ApiError.NOT_FOUND;
			const [err, res] = await Utils.resolve(doc.remove());
			// NOTE: is this error handling really needed?
			if (err)
				throw ApiError.INTERNAL_SERVER_ERROR;
			return res;
        },
	})
}
