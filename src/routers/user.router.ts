import { Router, Request, Response } from "express";
import { UserService } from "../services/user.service";
import {createUserSchema, updateUserSchema} from "../schemas/user.schema";
import {registerCrudRoutes} from "../utils/factories/crud.routes";

export class UserRouter {
    private userService: UserService;

    constructor(private readonly router: Router) {
        this.router = router;
        this.userService = new UserService();
        this.initRoutes();
    };

    private initRoutes() {
        registerCrudRoutes(
            {
                router: this.router,
                path: "users",
                handlers: {
                    getAll: this.getAll,
                    getById: this.getById,
                    create: this.create,
                    update: this.update,
                    delete: this.delete
                },
                schemas: {
                    create: createUserSchema,
                    update: updateUserSchema
                }
            });
    };

    private getAll = async (_req: Request, res: Response) => {
        try {
            const users = await this.userService.getAll();
            res.status(200).json({data: users, statusCode: 200});
        }
        catch(err) {
            res.status(500).json({error:"Server error"});
        }
    };

    private getById = async (req: Request, res: Response) => {
        try{
            const user = await this.userService.getById(req.params.id!);
            user
                ? res.status(200).json({ data: user, statusCode: 200 })
                : res.status(404).json({ message: `User not found, id: ${req.params.id}`});

        } catch(err) {
            res.status(500).json({error:"Server error"});
        }
    };

    private create = async (req: Request, res: Response) => {
       try {
           const {firstName, lastName, email, password} = req.body;
           if (!firstName || !lastName || !email || !password) {
               res.status(400).json({message: "Missing required fields"});
               return;
           }

           const newUser = await this.userService.create({firstName, lastName, email, password});
           res.status(200).json({data: newUser, statusCode: 200});
       } catch (err) {
           res.status(500).json({error:"Server error"});
       }
    };

    private update = async (req: Request, res: Response) => {
        try {
            const {firstName, lastName, email, password} = req.body;
            const updated = await this.userService.update(req.params.id!, {firstName, lastName, email, password});

            updated
                ? res.status(200).json({data: updated, statusCode: 200})
                : res.status(404).json({message: `User not found, id: ${req.params.id}`});
        } catch (err) {
            res.status(500).json({error:"Server error"});
        }
    };

    private delete = async (req: Request, res: Response) => {
        try {
            const deleted = await this.userService.delete(req.params.id!);
            deleted
                ? res.sendStatus(200)
                : res.status(404).json({message: `User cannot be deleted, id: ${req.params.id}`});
        } catch (err) {
            res.status(500).json({error:"Server error"});
        }
    };
}