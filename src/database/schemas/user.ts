import bcrypt from 'bcrypt';
import _ from 'lodash';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import express from 'express';
import Utils from '../../Utils';

export interface User extends mongoose.Document {
	fullname: string;
	email: string;
	password: string;
	role: UserRole;
}

export enum UserRole { // Will be used as integer greater or lower comparation
	GUEST = 0,
	USER = 1,
	MANAGER = 9,
	ADMIN = 99,
}

export const bcryptCompare = async (user: User, password: string): Promise<boolean> => {
	return await bcrypt.compare(password, user.password);
};

export const getUserFromToken = async (token: string): Promise<User | null> => {
	return await userModel.findById(jwt.decode(token)).exec();
};

export const getLocals = ({ locals }: express.Response) => ({
	role: locals.userRole as UserRole,
	user: locals.user as User | null,
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
});

export const createUserDTO = (obj: object) => _.pick(obj, ['fullname', 'fullname', 'email', 'password']);

export const userModel = mongoose.model<User>('User', userSchema);

export const userCRUD = Utils.crud<User>(userModel);
