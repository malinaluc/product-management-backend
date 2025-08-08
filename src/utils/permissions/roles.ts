import {UserRole} from "../../types/user.types";

export const roles: Record<UserRole, Record<string, string[]>> = {
    admin: {
        product: ['create', 'delete', 'update', 'view'],
        user: ['create', 'delete', 'update', 'view'],
        order: ['create', 'delete', 'update', 'view']
    },
    client: {
        product: [],
        user: [],
        order: ['create', 'delete', 'update', 'view']
    }
};