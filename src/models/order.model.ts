import {OrderProduct} from "../types/orderProduct.types";
import mongoose, {Schema} from "mongoose";

export interface OrderDocument extends Document {
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
})

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);