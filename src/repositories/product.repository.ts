import {FilterProduct, Product, ProductDto} from "../types/product.types";
import {ProductModel} from "../models/product.model";
import {SortOrder} from "mongoose";

export class ProductRepository {
    public async getAll(data: FilterProduct) : Promise<Product[]> {
        const filter: Record<string,any> = {};
        if (data.category) filter.category = data.category;

        const sortOption: Record<string, SortOrder> | undefined = data.sort
            ? { price: data.sort === "asc" ? 1 : -1 }
            : undefined;

        const page = data.page && data.page > 0 ? data.page : 1;
        const limit = data.limit && data.limit > 0 ? data.limit : 10;
        const skip = (page - 1) * limit;

        return await ProductModel.find(filter).sort(sortOption).skip(skip).limit(limit);
    };

    public async getById(id: string): Promise<Product | null> {
        return await ProductModel.findById(id);
    };

    public async create(data: ProductDto): Promise<Product> {
        const newProduct = new ProductModel(data);
        return await newProduct.save();
    };

    public async update(id: string, data: ProductDto): Promise<Product | null> {
        return await ProductModel.findByIdAndUpdate(id, data, { new: true });
    };

    public async delete(id: string): Promise<boolean> {
        const result = await ProductModel.findByIdAndDelete(id);
        return !!result;
    };
}