import { Router, Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderRouter {
    private orderService: OrderService;

    constructor(private router: Router) {
        this.router = router;
        this.orderService = new OrderService();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get("/orders", this.getAll);
        this.router.get("/orders/:id", this.getById);
        this.router.post("/orders", this.create);
        this.router.delete("/orders/:id", this.delete);
    }

    private getAll = async (_req: Request, res: Response) => {
        try{
            const orders = await this.orderService.getAll();
            res.status(200).json({ data: orders, statusCode: 200 });
        } catch (err) {
            res.status(500).json("Server error");
        }
    };

    private getById = async (req: Request, res: Response) => {
        try {
            const order = this.orderService.getById(req.params.id!);
            order
                ? res.status(200).json({data: order, statusCode: 200})
                : res.status(404).json("Order not found");
        } catch (err) {
            res.status(500).json("Server error");
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
        } catch (err: any) {
            res.status(400).json("Cannot create order");
        }
    };

    private delete = async (req: Request, res: Response) => {
        try {
            const deleted = await this.orderService.delete(req.params.id!);
            deleted
                ? res.sendStatus(200)
                : res.status(404).json("Order not found");
        } catch (err) {
            res.status(500).json("Server error");
        }
    };
}