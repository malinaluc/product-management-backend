import { validateData } from "../../middlewares/validation.middleware";
import { RegisterCrudRoutes } from "../../types/router.types";

export function registerCrudRoutes(data: RegisterCrudRoutes) {
    const base = `/${data.path}`;

    data.router.get(`${base}`, data.handlers.getAll);
    data.router.get(`${base}/:id`, data.handlers.getById);

    data.router.get(
        `${base}`,
        ...(data.middlewares?.getAll || []),
        data.handlers.getAll
    );


    data.router.get(
        `${base}/:id`,
        ...(data.middlewares?.getById || []),
        data.handlers.getById
    );


    if (data.schemas?.create) {
        data.router.post(
            base,
            ...(data.middlewares?.create || []),
            validateData(data.schemas.create),
            data.handlers.create
        );
    } else {
        data.router.post(
            base,
            ...(data.middlewares?.create || []),
            data.handlers.create
        );
    }

    if (data.schemas?.update) {
        data.router.put(
            `${base}/:id`,
            ...(data.middlewares?.update || []),
            validateData(data.schemas.update),
            data.handlers.update
        );
    } else {
        data.router.put(
            `${base}/:id`,
            ...(data.middlewares?.update || []),
            data.handlers.update
        );
    }

    data.router.delete(
        `${base}/:id`,
        ...(data.middlewares?.delete || []),
        data.handlers.delete
    );
}