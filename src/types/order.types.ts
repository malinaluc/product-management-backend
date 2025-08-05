import {OrderProduct} from "./orderProduct.types";

export type Order = {
    id?: string;
    userId: string;
    products: OrderProduct[];
    totalAmount: number;
};