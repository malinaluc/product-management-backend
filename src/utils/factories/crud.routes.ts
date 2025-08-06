import {validateData} from "../../middleware/validation.middleware";
import {RegisterCrudRoutes} from "../../types/router.types";

export function registerCrudRoutes(data: RegisterCrudRoutes) {
    data.router.get(`/${data.path}`, data.handlers.getAll);
    data.router.get(`/${data.path}/:id`, data.handlers.getById);

    if (data.schemas?.create) {
        data.router.post(`/${data.path}`, validateData(data.schemas.create), data.handlers.create);
    } else {
        data.router.post(`/${data.path}`, data.handlers.create);
    }

    if (data.schemas?.update) {
        data.router.put(`/${data.path}/:id`, validateData(data.schemas.update), data.handlers.update);
    } else {
        data.router.put(`/${data.path}/:id`, data.handlers.update);
    }

    data.router.delete(`/${data.path}/:id`, data.handlers.delete);
}