import {OrderProduct} from "../types/orderProduct.types";

export type OrderDto = {
    userId: string;
    products: OrderProduct[];
    totalAmount: number;
};