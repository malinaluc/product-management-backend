import {roles} from "../utils/permissions/roles";
import {Request, Response, NextFunction } from 'express';

export const checkRole = (action: string, resource: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole || !(userRole in roles)) {
            return res.status(403).json({ message: 'Access Denied: Invalid or missing role' });
        }

        const allowedActions = roles[userRole][resource] || [];

        if (!allowedActions.includes(action)) {
            return res.status(403).json({ message: 'Access Denied: Permission denied' });
        }

        return next();
    };
};