import * as jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY} from '../../config/environment';
import { UserPayload } from '../../types/user.types';

export const generateToken = (payload: UserPayload): string => {
    return jwt.sign(payload, JWT_SECRET_KEY as jwt.Secret);
};