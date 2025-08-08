import { Request, Response, NextFunction } from 'express';

export const checkNotBanned = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user?.banned) {
        return res.status(403).json({ message: 'You are banned from this action'});
    }
    next();
};