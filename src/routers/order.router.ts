import { Router, Request, Response } from "express";
import { OrderService } from "../services/order.service";
import {createOrderSchema, updateOrderSchema} from "../schemas/order.schema";
import {registerCrudRoutes} from "../utils/factories/crud.routes";
import {authenticate} from "../middlewares/authentication.middleware";
import {checkNotBanned} from "../middlewares/banned.middleware";

export class OrderRouter {
    private orderService: OrderService;

    constructor(private readonly router: Router) {
        this.router = router;
        this.orderService = new OrderService();
        this.initRoutes();
    };

    private initRoutes() {
        registerCrudRoutes(
            {
                router: this.router,
                path: "orders",
                handlers: {
                    getAll: this.getAll,
                    getById: this.getById,
                    create: this.create,
                    update: this.update,
                    delete: this.delete
                },
                schemas: {
                    create: createOrderSchema,
                    update: updateOrderSchema
                },
                middlewares: {
                    getAll: [authenticate],
                    getById: [authenticate],
                    create: [authenticate, checkNotBanned],
                    update: [authenticate, checkNotBanned],
                    delete: [authenticate, checkNotBanned]
                }
            });
    };

    private getAll = async (_req: Request, res: Response) => {
        try{
            const orders = await this.orderService.getAll();
            res.status(200).json({ data: orders, statusCode: 200 });
        } catch (err) {
            res.status(500).json({error: "Server error"});
        }
    };

    private getById = async (req: Request, res: Response) => {
        try {
            const order = await this.orderService.getById(req.params.id!);
            order
                ? res.status(200).json({data: order, statusCode: 200})
                : res.status(404).json("Order not found");
        } catch (err) {
            res.status(500).json({error: "Server error"});
        }
    };

    private create = async (req: Request, res: Response) => {
        try {
            const { userId, products } = req.body;
            if (!userId || !Array.isArray(products) || products.length === 0) {
                return res.status(400).json("Missing required fields");
            }

            const order = await this.orderService.create(userId, products);
            res.status(201).json({ data: order, statusCode: 201 });
        } catch (err) {
            res.status(400).json({error: "Cannot create order"});
        }
    };

    private update = async (req: Request, res: Response) => {
        try {
            const updatedOrder = await this.orderService.update(req.params.id!, req.body);
            updatedOrder
                ? res.status(200).json({ data: updatedOrder, statusCode: 200 })
                : res.status(404).json("Order not found");
        } catch (err) {
            res.status(500).json({error: "Server error"});
        }
    };

    private delete = async (req: Request, res: Response) => {
        try {
            const deleted = await this.orderService.delete(req.params.id!);
            deleted
                ? res.sendStatus(200)
                : res.status(404).json("Order not found");
        } catch (err) {
            res.status(500).json({error: "Server error"});
        }
    };
}