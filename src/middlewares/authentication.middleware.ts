import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/environment';
import { UserModel } from '../models/user.model';
import {UserPayload} from "../types/user.types";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing token'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token!, JWT_SECRET_KEY) as UserPayload;
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token'});
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized'});
    }
};