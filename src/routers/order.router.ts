import { Router, Request, Response } from "express";
import { OrderService } from "../services/order.service";
import {validateData} from "../middleware/validation.middleware";
import {createOrderSchema, updateOrderSchema} from "../schemas/order.schema";

export class OrderRouter {
    private orderService: OrderService;

    constructor(private router: Router) {
        this.router = router;
        this.orderService = new OrderService();
        this.initRoutes();
    };

    private initRoutes() {
        this.router.get("/orders", this.getAll.bind(this));
        this.router.get("/orders/:id", this.getById.bind(this));
        this.router.post("/orders", validateData(createOrderSchema),this.create.bind(this));
        this.router.delete("/orders/:id", this.delete.bind(this));
        this.router.put("/orders/:id", validateData(updateOrderSchema),this.update.bind(this));
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