import express from 'express';
import Config from '../Config';
import { createUserDTO, User, userModel, UserRole, getLocals, bcryptCompare } from '../database/schemas/user';
import Utils from '../Utils';
import ApiError from './ApiError';

const api = express.Router();

const userCrud = Utils.crud(userModel);

// ROLE: UserRole.GUEST
/*
    USE (/api/v1/register) {
        fullname, email, password
    } => OK Response;
*/
api.use('/register', async (req: express.Request<User>, res) => {
    const { user } = getLocals(res);
    if (user)
        throw ApiError.LOGOUT_FIRST;
    req.body.password = await Utils.bcryptHash(req.body.password);
    await userCrud.post(createUserDTO(req.body));
    res.send();
});

/*
    USE (/api/v1/login) {
        username, email, password
    } => OK Response;
*/
api.use('/login', async (req: express.Request<User>, res) => {
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
    const rememberMe: boolean = req.query.rememberme;
    res.cookie(Config.TOKEN_HEADER, Utils.generateToken(find[0]._id, rememberMe),
        { expires: new Date(Date.now() + Config.TOKEN_EXPIRES(rememberMe)) }).send();
});

/*
    GET (/api/v1/me) => User object;
*/
api.use('/me', (_req, res) => {
    res.send(res.locals.user);
});

/*
    USE (/api/v1/logout) => OK Response;
*/
api.use('/logout', (_req, res) => {
    const { user } = res.locals;
    if (!user)
        throw ApiError.ALREADY_LOGGED_OUT;
    res.cookie(Config.TOKEN_HEADER, '').send();
})

const checkRole = (userRole: UserRole): express.RequestHandler => (_req, res, next) => {
    const { user, role } = getLocals(res);
    if (!user || role < userRole)
        throw ApiError.NOT_PERMITTED;
    next();
}

// ROLE: UserRole.USER
/*
    GET (/api/v1/users) => Array of User object
*/
api.get('/users', checkRole(UserRole.ADMIN), async (_req, res) => {
    return res.send(await userModel.find().exec());
});

// ROLE: UserRole.ADMIN

export default api;