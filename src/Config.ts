import AppMode from "./AppMode";

export default class Config {
    static readonly MODE = process.env.NODE_ENV === 'production' ? AppMode.PRODUCTION : AppMode.DEVELOPMENT;
    static readonly USERDB = process.env.SS_USERDB || 'dbUser';
    static readonly PASSDB = process.env.SS_PASSDB || 'dbPwd';
    static readonly TOKEN_HEADER = 'X-Auth-Token';
    static readonly TOKEN_PASSKEY = process.env.SS_TOKEN_PASSKEY || 'dontusethisone!';
    static readonly PORT = Number(process.env.PORT) || 3000;
    static readonly DB = `mongodb+srv://${Config.USERDB}:${Config.PASSDB}@cluster0-4h1fv.mongodb.net/test?retryWrites=true&w=majority`;
    static readonly URL = 'http://chempro_backend.herokuapp.com/';
    static readonly TOKEN_EXPIRES = (rememberMe: boolean) => 1000*60*60*24*(rememberMe ? 30 : 1);
}