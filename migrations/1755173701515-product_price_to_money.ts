import mongoose from "mongoose";
import {connect} from "./config/index";

const DEFAULT_CURRENCY: "EUR" | "USD" = "EUR";

export const up = async (): Promise<void> => {
    await connect();
    const products = mongoose.connection.collection("products");

    await products.updateMany(
        { price: { $type: "number" }},
        [ { $set: { price: {
                        amount: "$price",
                        currency: DEFAULT_CURRENCY
        }}}]
    );
};

export const down = async (): Promise<void> => {
    await connect();
    const Products = mongoose.connection.collection("products");

    await Products.updateMany(
        { "price.amount": { $exists: true }},
        [
            { $set: { price: "$price.amount" }}
        ]
    );
};