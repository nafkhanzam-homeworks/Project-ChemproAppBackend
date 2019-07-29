import express from "express";
import { PathParams } from "express-serve-static-core";

type MethodType = "use" | "delete" | "put" | "post" | "get";

export default class ApiWrapper {
    private handlers: [MethodType, PathParams, express.RequestHandler[]][] = [];
    public apply(api: express.Application | express.Router): express.Application | express.Router {
        this.handlers.forEach((data) => {
            const handlers: express.RequestHandler[] = [];
            data[2].forEach((handler) => {
                handlers.push(async (req, res, next) => {
                    try {
                        await handler(req, res, next);
                    } catch (err) {
                        next(err);
                    }
                });
            });
            api[data[0]](data[1], ...handlers);
        });
        return api;
    }
    private add(method: MethodType, path: PathParams, handlers: express.RequestHandler[]) {
        this.handlers.push([method, path, handlers]);;
    }
    public use(path: PathParams, ...handlers: express.RequestHandler[]) {
        this.add("use", path, handlers);
    }
    public get(path: PathParams, ...handlers: express.RequestHandler[]) {
        this.add("get", path, handlers);
    }
    public delete(path: PathParams, ...handlers: express.RequestHandler[]) {
        this.add("delete", path, handlers);
    }
    public put(path: PathParams, ...handlers: express.RequestHandler[]) {
        this.add("put", path, handlers);
    }
    public post(path: PathParams, ...handlers: express.RequestHandler[]) {
        this.add("post", path, handlers);
    }
}