import {z} from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Name is required").transform(val => val.trim()),
    category: z.string().min(1, "Category is required").transform(val => val.trim()),
    price: z.number().nonnegative("Price must be postivie integer"),
    stock: z.number().int().nonnegative("Stock must be a postivie integer")
});

export const updateProductSchema = z.object({
    name: z.string().min(1, "Name is required").transform(val => val.trim()).optional(),
    category: z.string().min(1, "Category is required").transform(val => val.trim()).optional(),
    price: z.number().nonnegative("Price must be postivie integerr").optional(),
    stock: z.number().int().nonnegative("Stock must be a postivie integer").optional()
});