import {ProductRepository} from "../repositories/product.repository";
import {Product} from "../types/product.types";
import {ProductDto} from "../dtos/product.dto";

export class ProductService {
    private productRepository = new ProductRepository();

    public async getAll(): Promise<Product[]> {
        return await this.productRepository.getAll();
    }

    public async getById(id: string): Promise<Product | null> {
        return await this.productRepository.getById(id);
    }

    public async create(data: ProductDto): Promise<Product> {
        return await this.productRepository.create(data);
    }

    public async update(id: string, data: ProductDto): Promise<Product | null> {
        return await this.productRepository.update(id, data);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.productRepository.delete(id);
    }
}