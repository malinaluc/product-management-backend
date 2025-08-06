import { Router, Request, Response } from "express";
import { ProductService } from "../services/product.service";
import {FilterProduct} from "../types/product.types";
import {createProductSchema, updateProductSchema} from "../schemas/product.schema";
import {registerCrudRoutes} from "../utils/factories/crud.routes";

export class ProductRouter {
    private productService: ProductService;

    constructor(private readonly router: Router) {
        this.router = router;
        this.productService = new ProductService();
        this.initRoutes();
    };

    private initRoutes() {
        registerCrudRoutes(
            {
                router: this.router,
                path: "products",
                handlers: {
                    getAll: this.getAll,
                    getById: this.getById,
                    create: this.create,
                    update: this.update,
                    delete: this.delete
            },
            schemas: {
                create: createProductSchema,
                update: updateProductSchema
            }
        });
    };

    private getAll = async (req: Request, res: Response) => {
        try {
            const category = req.query.category as string | undefined;
            const sort = req.query.sort as "asc" | "desc" | undefined;
            const page = req.query.page ? parseInt(req.query.page as string) : undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

            const data: FilterProduct = {category, sort, page, limit};

            const products = await this.productService.getAll(data);

            res.status(200).json({ data: products, statusCode: 200 });
        } catch (err) {
            res.status(500).json({error:"Server error"});
        }
    };

    private getById = async (req: Request, res: Response) => {
        try {
            const product = await this.productService.getById(req.params.id!);
            product
                ? res.status(200).json({ data: product, statusCode: 200 })
                : res.status(404).json({ error: `Product not found, id: ${req.params.id}` });
        } catch (err) {
            res.status(500).json({error:"Server error"});
        }
    };

    private create = async (req: Request, res: Response) => {
        try {
            const { name, category, price, stock } = req.body;
            if (!name || price == null || stock == null || category == null) {
                res.status(400).json({ message: "Missing required fields"});
                return;
            }
            const newProduct = await this.productService.create({ name, category, price, stock });
            res.status(201).json({ data: newProduct, statusCode: 201 });
        } catch (err) {
            res.status(500).json({error:"Server error"});
        }
    };

    private update = async (req: Request, res: Response) => {
        try {
            const { name, category, price, stock } = req.body;
            const updated = await this.productService.update(req.params.id!, { name, category, price, stock });

            updated
                ? res.json({ data: updated, statusCode: 200 })
                : res.status(404).json({ error: `Product not found, id: ${req.params.id}` });
        } catch (err) {
            res.status(500).json({error:"Server error"});
        }
    };

    private delete = async (req: Request, res: Response) => {
        try {
            const deleted = await this.productService.delete(req.params.id!);
            deleted
                ? res.sendStatus(200)
                : res.status(404).json({ error: `Product can't be deleted, id: ${req.params.id}`});
        } catch (err) {
            res.status(500).json({error: "Server error"});
        }
    };
}