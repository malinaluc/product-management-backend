import {Order, OrderUpdateDto} from "../types/order.types";
import { OrderRepository } from "../repositories/order.repository";
import {IProductDocument, ProductModel} from "../models/product.model";

import {OrderProduct} from "../types/product.types";

export class OrderService {
    private orderRepository = new OrderRepository();

    public async getAll(): Promise<Order[]> {
        return await this.orderRepository.getAll();
    };

    public async getById(id: string): Promise<Order | null> {
        return await this.orderRepository.getById(id);
    };

    public async create(userId: string, products: OrderProduct[]) : Promise<Order> {
        const productIds = products.map(p => p.id);
        const dbProducts = await ProductModel.find({ _id: { $in: productIds } }) as IProductDocument[];

        let totalAmount = 0;
        for (const p of products) {
            const productInDb = dbProducts.find(dbp => dbp.id.toString() === p.id);

            if (!productInDb) throw new Error(`Product with id ${p.id} not found`);

            if (productInDb.stock < p.quantity) {
                throw new Error(`Insufficient stock for product ${productInDb.name}`);
            }

            totalAmount += productInDb.price * p.quantity;
        }

        for (const p of products) {
            const productInDb = dbProducts.find(dbp => dbp.id.toString() === p.id);
            if (productInDb) {
                productInDb.stock -= p.quantity;
                await productInDb.save();
            }
        }

        return await this.orderRepository.create({ userId, products, totalAmount });
    };

    public async update(id: string, data: OrderUpdateDto) {
        const existingOrder = await this.orderRepository.getById(id);
        if (!existingOrder) {
            throw new Error(`Order with id ${id} not found`);
        }

        const newProducts = data.products;

        for (const prod of existingOrder.products) {
            const product = await ProductModel.findById(prod.id);
            if (product) {
                product.stock += prod.quantity;
                await product.save();
            }
        }

        const productIds = newProducts.map(p => p.id);
        const dbProducts = await ProductModel.find({ _id: { $in: productIds } });

        let newTotal = 0;
        for (const prod of newProducts) {
            const productInDb = dbProducts.find(p => p.id.toString() === prod.id);
            if (!productInDb) throw new Error(`Product with id ${prod.id} not found`);

            if (productInDb.stock < prod.quantity) {
                throw new Error(`Insufficient stock for product ${productInDb.name}`);
            }

            newTotal += productInDb.price * prod.quantity;
        }

        for (const prod of newProducts) {
            const product = dbProducts.find(p => p.id.toString() === prod.id);
            if (product) {
                product.stock -= prod.quantity;
                product.markModified("stock");
                await product.save();
            }
        }

        const updatedOrder = await this.orderRepository.update(id, {
            products: newProducts,
            totalAmount: newTotal,
        });

        return updatedOrder;
    };

    public async delete(id: string): Promise<boolean> {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new Error(`Order with id ${id} not found`);
        }

        for (const prod of order.products) {
            const product = await ProductModel.findById(prod.id);
            if (product) {
                product.stock += prod.quantity;
                product.markModified("stock");
                await product.save();
            }
        }

        return await this.orderRepository.delete(id);
    };
}