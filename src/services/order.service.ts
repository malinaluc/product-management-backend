import { Order } from "../types/order.types";
import { OrderRepository } from "../repositories/order.repository";
import {ProductDocument, ProductModel} from "../models/product.model";
import {OrderProduct} from "../types/orderProduct.types";

export class OrderService {
    private orderRepository = new OrderRepository();

    public async getAll(): Promise<Order[]> {
        return await this.orderRepository.getAll();
    }

    public async getById(id: string): Promise<Order | null> {
        return await this.orderRepository.getById(id);
    }

    public async create(userId: string, products: OrderProduct[]) : Promise<Order> {
        const productIds = products.map(p => p.id);
        const dbProducts = await ProductModel.find({ _id: { $in: productIds } }) as ProductDocument[];

        let totalAmount = 0;
        for (const p of products) {
            const productInDb = dbProducts.find(dbp => dbp.id.toString() === p.id);
            if (!productInDb) throw new Error(`Product with ID ${p.id} not found`);
            totalAmount += productInDb.price * p.quantity;
        }

        return await this.orderRepository.create({ userId, products, totalAmount });
    }

    public async delete(id: string): Promise<boolean> {
        return await this.orderRepository.delete(id);
    }
}