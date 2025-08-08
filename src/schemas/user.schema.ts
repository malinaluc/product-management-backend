import {z} from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1, "FirstName is required").transform(val => val.trim()),
    lastName: z.string().min(1, "LastName is required").transform(val => val.trim()),
    email: z.string().min(1, "Email is required").transform(val => val.trim()),
    password: z.string().min(1, "Password is required"),
    role: z.string().min(1, "Role is required").transform(val => val.trim())
});

export const updateUserSchema = z.object({
    firstName: z.string().min(1, "FirstName is required").transform(val => val.trim()).optional(),
    lastName: z.string().min(1, "LastName is required").transform(val => val.trim()).optional(),
    email: z.string().min(1, "Email is required").transform(val => val.trim()).optional(),
    password: z.string().min(1, "Password is required").optional(),
    role: z.string().min(1, "Role is required").transform(val => val.trim()).optional()
});