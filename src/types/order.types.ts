import {OrderProduct} from "./product.types";

export type Order = {
    id?: string;
    userId: string;
    products: OrderProduct[];
    totalAmount: number;
};

export type OrderDto = {
    userId: string;
    products: OrderProduct[];
    totalAmount: number;
};

export type OrderUpdateDto = {
    products: OrderProduct[];
    totalAmount?: number;
};