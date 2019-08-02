import AppMode from "./AppMode";

const defaultPasskey = "567";

export default class Config {
    public static readonly MODE = process.env.NODE_ENV === "production" ? AppMode.PRODUCTION : AppMode.DEVELOPMENT;
    public static readonly USERDB = process.env.SS_USERDB || "dbAdmin";
    public static readonly PASSDB = process.env.SS_PASSDB || "dbPwd";
    public static readonly TOKEN_HEADER = "X-Auth-Token";
    public static readonly TOKEN_PASSKEY = process.env.SS_TOKEN_PASSKEY || defaultPasskey;
    public static readonly COOKIE_PASSKEY = process.env.SS_COOKIE_PASSKEY || defaultPasskey;
    public static readonly PORT = Number(process.env.PORT) || 3000;
    public static readonly DB = `mongodb+srv://${Config.USERDB}:${Config.PASSDB}@cluster0-tubrr.gcp.mongodb.net/test?retryWrites=true&w=majority`;
    public static readonly URL = "http://substat.herokuapp.com/";
    public static readonly TOKEN_EXPIRES = 1000 * 60 * 60 * 24;
    public static readonly TOKEN_EXPIRES_LONGER = Config.TOKEN_EXPIRES * 30;
    public static readonly CLIENT_URL = "http://localhost:5000";
}
