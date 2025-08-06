import {RequestHandler, Router} from "express";
import {ZodTypeAny} from "zod";

export type CrudRoutes = {
    getAll: RequestHandler;
    getById: RequestHandler;
    create: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
};

export type CrudSchemas = {
    create?: ZodTypeAny;
    update?: ZodTypeAny;
};

export type RegisterCrudRoutes = {
    router: Router;
    path: string;
    handlers: CrudRoutes;
    schemas: CrudSchemas;
};