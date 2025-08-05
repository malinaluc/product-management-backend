import { Product } from "../types/product.types";
import {ProductModel} from "../models/product.model";
import {ProductDto} from "../dtos/product.dto";

export class ProductRepository {

    public async getAll(): Promise<Product[]> {
        return await ProductModel.find();
    }

    public async getById(id: string): Promise<Product | null> {
        return await ProductModel.findById(id);
    }

    public async create(data: ProductDto): Promise<Product> {
        const newProduct = new ProductModel(data);
        return await newProduct.save();
    }

    public async update(id: string, data: ProductDto): Promise<Product | null> {
        return await ProductModel.findByIdAndUpdate(id, data, { new: true });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await ProductModel.findByIdAndDelete(id);
        return !!result;
    }
}