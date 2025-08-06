import mongoose, {Schema} from "mongoose";
import {OrderProduct} from "../types/product.types";

export interface IOrderDocument extends Document {
    userId: string;
    products: OrderProduct[];
    totalAmount: number;
}

const OrderSchema: Schema= new Schema({
    userId: {type: String, required: true},
    products: {
        type: [
            {
                id: { type: String, required: true },
                quantity: { type: Number, required: true }
            }
        ],
        required: true
    },
    totalAmount: {type: Number, required: true}
});

export const OrderModel = mongoose.model<IOrderDocument>("Order", OrderSchema);