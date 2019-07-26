import Logger from './Logger';
import Server from './Server';
import Config from './Config';
import AppMode from './AppMode';

if (Config.MODE === AppMode.PRODUCTION)
    require('heroku-self-ping')(Config.URL);

declare module "express" {
    export interface Request<
      Body = any,
      Query = any,
      Params = any,
      Cookies = any,
    > extends Express.Request {
      body: Body;
      query: Query;
      params: Params;
      cookies: Cookies;
    }
    export interface Response<Locals = any> extends Express.Response {
        locals: Locals;
    }
}

Logger.init();
const server = new Server();
server.start();
console.log("test changes");