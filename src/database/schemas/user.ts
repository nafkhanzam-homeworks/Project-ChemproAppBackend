import bcrypt from 'bcrypt';
import _ from 'lodash';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import express from 'express';
import Utils from '../../Utils';

export interface IUser extends mongoose.Document {
	fullname: string;
	email: string;
	password: string;
	role: UserRole;
	NIM: string;
}

export enum UserRole { // Will be used as integer greater or lower comparation
	GUEST = 0,
	BUYER = 1,
	ADMIN = 99,
}

export const bcryptCompare = async (user: IUser, password: string): Promise<boolean> => {
	return await bcrypt.compare(password, user.password);
};

export const getUserFromToken = async (token: string): Promise<IUser | null> => {
	return await userModel.findById(jwt.decode(token)).exec();
};

export const getLocals = ({ locals }: express.Response) => ({
	role: locals.userRole as UserRole,
	user: locals.user as IUser | null,
});

const userSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: UserRole,
		default: UserRole.GUEST,
	},
	NIM: String,
});

export const createUserDTO = (obj: object) => _.pick(obj, ['fullname', 'email', 'password']);

export const userModel = mongoose.model<IUser>('User', userSchema);

export const userCRUD = Utils.crud<IUser>(userModel);
