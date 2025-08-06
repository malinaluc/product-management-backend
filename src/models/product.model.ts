import mongoose, {Schema, Document} from "mongoose";

export interface IProductDocument extends Document {
    name: string;
    category: string;
    price: number;
    stock: number;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});

export const ProductModel = mongoose.model<IProductDocument>("Product", ProductSchema);