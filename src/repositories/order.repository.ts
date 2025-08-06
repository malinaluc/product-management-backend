import {Order, OrderDto, OrderUpdateDto} from "../types/order.types";
import {OrderModel} from "../models/order.model";


export class OrderRepository {
    public async getAll(): Promise<Order[]> {
        return await OrderModel.find();
    };

    public async getById(id: string): Promise<Order | null> {
        return await OrderModel.findById(id);
    };

    public async create(order: OrderDto): Promise<Order> {
        const newOrder = new OrderModel(order);
        return await newOrder.save();
    };

    public async update(id: string, data: OrderUpdateDto): Promise<Order | null> {
        return await OrderModel.findByIdAndUpdate(id, data, { new: true });
    };

    public async delete(id: string): Promise<boolean> {
        const result = await OrderModel.findByIdAndDelete(id);
        return !!result;
    };
}