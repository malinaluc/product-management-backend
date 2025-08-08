import { Router, Request, Response } from 'express';
import {AuthService} from "../services/auth.service";

export class AuthRouter {
    private authService: AuthService;

    constructor(private readonly router: Router) {
        this.router = router;
        this.authService = new AuthService();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post('/auth/login', this.login);
        this.router.post('/auth/signup', this.signup);
        this.router.post('/auth/logout', this.logout);
    };

    private login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        console.log("login: ",email, password);
        const result = await this.authService.login(email, password);

        if (!result) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { token, user } = result;
        return res.status(200).json({ token, user });
    };

    private signup = async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, email, password} = req.body;

            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const result = await this.authService.signup({ firstName, lastName, email, password, role: 'client'});

            if (!result) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const { token, user } = result;
            return res.status(201).json({ token, user });
        } catch (err: any) {
            res.status(400).json({message: "Signup failed" });
        }
    };

    private logout = async (_req: Request, res: Response) => {
        res.status(200).json({ message: "Logged out successfully" });
    };
}