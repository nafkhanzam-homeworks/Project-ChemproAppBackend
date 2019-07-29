import express from "express";
import mongoose from "mongoose";
import ApiError from "../ApiError";
import ApiWrapper from "../ApiWrapper";
import Config from "../Config";
import { bcryptCompare, createUserDTO, getCrud, getLocals, userModel, UserRole } from "../database/schemas/user";
import Utils from "../Utils";

// TODO: Add api object to wrap the arguments to be catchable async function..
const _api = express.Router();
const api = new ApiWrapper();

const userCrud = Utils.crud(userModel);

function sendAuthCookie(res: express.Response, _id: string, rememberMe: boolean) {
    res.cookie(Config.TOKEN_HEADER, Utils.generateToken(_id, rememberMe), {
        maxAge: rememberMe ? Config.TOKEN_EXPIRES_LONGER : Config.TOKEN_EXPIRES,
    }).send();
}

// ROLE: UserRole.GUEST
/*
    USE (/api/v1/register) {
        fullname, email, password
    } => OK Response (auth cookie will be set);
*/
api.use("/register", async (req: express.Request, res) => {
    const { user } = getLocals(res);
    if (user)
        throw ApiError.LOGOUT_FIRST;
    req.body.password = await Utils.bcryptHash(req.body.password);
    const doc = await userCrud.post(createUserDTO(req.body));
    sendAuthCookie(res, doc._id, false);
});

/*
    USE (/api/v1/login) {
        username, email, password
    } => OK Response (auth cookie will be set);
*/
api.use("/login", async (req: express.Request, res) => {
    console.log(req.cookies[Config.TOKEN_HEADER]);
    const { user } = getLocals(res);
    if (user)
        throw ApiError.LOGOUT_FIRST;
    const { email, password } = req.body;
    if (!email || !password)
        throw ApiError.BAD_REQUEST;
    const find = await userModel.find({ email }).exec();
    if (find.length === 0)
        throw ApiError.USERNAME_EMAIL_NOT_EXIST;
    if (!await bcryptCompare(find[0], password))
        throw ApiError.WRONG_PASSWORD;
    const rememberMe: boolean = !!req.query.rememberme;
    sendAuthCookie(res, find[0]._id, rememberMe);
});

/*
    GET (/api/v1/me) => User object;
*/
api.use("/me", (_req, res) => {
    res.send(res.locals.user);
});

/*
    USE (/api/v1/logout) => OK Response;
*/
api.use("/logout", (_req, res) => {
    const { user } = res.locals;
    if (!user)
        throw ApiError.ALREADY_LOGGED_OUT;
    res.clearCookie(Config.TOKEN_HEADER).send();
});

const checkRole = (userRole: UserRole): express.RequestHandler => (_req, res, next) => {
    const { user, role } = getLocals(res);
    if (!user || role < userRole)
        throw ApiError.NOT_PERMITTED;
    next();
};

// ROLE: UserRole.USER
/*
    GET (/api/v1/users) => Array of User object
*/
api.get("/users", checkRole(UserRole.ADMIN), async (_req, res) => {
    return res.send(await userModel.find().exec());
});

// ROLE: UserRole.MANAGER
// '/(teams|matches|players)(/:id)?'
api.get(/^\/(teams|matches|players)\/:id/i, checkRole(UserRole.MANAGER), async (req, res) => {
    const { user } = getLocals(res);
    if (!user)
        throw ApiError.NOT_PERMITTED;
    // NOTE: too ugly?
    const owned = getCrud(req);
    const id = req.params.id;
    res.send(id ? await user.getOwn(owned, id) : await user.getOwns(owned));
});

api.post(/^\/((teams|matches|players)\/?)$/i, checkRole(UserRole.MANAGER), async (req, res) => {
    const { user } = getLocals(res);
    if (!user)
        throw ApiError.NOT_PERMITTED;
    // NOTE: too ugly?
    const owned = getCrud(req);
    const result = await owned.crud.post(owned.createDto(req.body));
    user[owned.typeOwned].push(result._id);
    await user.save();
    res.send(result);
});

api.put(/^\/(teams|matches|players)\/:id/i, checkRole(UserRole.MANAGER), async (req, res) => {
    const { user, role } = getLocals(res);
    if (!user)
        throw ApiError.NOT_PERMITTED;
    const owned = getCrud(req);
    const id: string = req.params.id;
    if (!user[owned.typeOwned].includes(new mongoose.Schema.Types.ObjectId(id)) && role !== UserRole.ADMIN)
        throw ApiError.NOT_PERMITTED;
    res.send(await owned.crud.put(id, owned.createDto(req.body)));
});

api.delete(/^\/(teams|matches|players)\/:id/i, checkRole(UserRole.MANAGER), async (req, res) => {
    const { user, role } = getLocals(res);
    if (!user)
        throw ApiError.NOT_PERMITTED;
    const owned = getCrud(req);
    const id: string = req.params.id;
    if (!user[owned.typeOwned].includes(new mongoose.Schema.Types.ObjectId(id)) && role !== UserRole.ADMIN)
        throw ApiError.NOT_PERMITTED;
    res.send(await owned.crud.delete(id));
});

// ROLE: UserRole.ADMIN

export default api.apply(_api);
