import { Order } from "../types/order.types";
import {OrderModel} from "../models/order.model";
import {OrderDto} from "../dtos/order.dto";

export class OrderRepository {
    public async getAll(): Promise<Order[]> {
        return await OrderModel.find();
    }

    public async getById(id: string): Promise<Order | null> {
        return await OrderModel.findById(id);
    }

    public async create(order: OrderDto): Promise<Order> {
        const newOrder = new OrderModel(order);
        return await newOrder.save();
    }

    public async delete(id: string): Promise<boolean> {
        const result = await OrderModel.findByIdAndDelete(id);
        return !!result;
    }
}