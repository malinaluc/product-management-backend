import {ProductRepository} from "../repositories/product.repository";
import {FilterProduct, Product, ProductDto} from "../types/product.types";

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    };

    public async getAll(data: FilterProduct): Promise<Product[]> {
        return await this.productRepository.getAll(data);
    };

    public async getById(id: string): Promise<Product | null> {
        return await this.productRepository.getById(id);
    };

    public async create(data: ProductDto): Promise<Product> {
        return await this.productRepository.create(data);
    };

    public async update(id: string, data: ProductDto): Promise<Product | null> {
        return await this.productRepository.update(id, data);
    };

    public async delete(id: string): Promise<boolean> {
        return await this.productRepository.delete(id);
    };
}