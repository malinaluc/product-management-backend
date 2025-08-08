import { Request, Response, NextFunction } from 'express';

export const checkNotBanned = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.banned) {
        return res.status(403).json({ message: 'You are banned from this action'});
    }
    next();
};