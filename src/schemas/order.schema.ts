import {z} from "zod";

const orderProductSchema = z.object({
    id: z.string().min(1, "ProductId is required").transform(val => val.trim()),
    quantity: z.number().int().positive("Quantity must be a positive integer")
});

export const createOrderSchema = z.object({
    userId: z.string().min(1, "UserId is required").transform(val => val.trim()),
    products: z.array(orderProductSchema).min(1, "Order must include at least one product")
});

export const updateOrderSchema = z.object({
    products: z.array(orderProductSchema).min(1, "Order must include at least one product"),
    totalAmount: z.number().nonnegative("TotalAmount must be postivie integer")
});