import {ProductRepository} from "../../src/repositories/product.repository";
import { ProductModel as PMExport } from "../../src/models/product.model";

jest.mock("../../src/models/product.model");

type ProductModelMock = jest.Mock & {
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
};

describe('ProductRepository', () => {
    let repo: ProductRepository;
    let ProductModel: ProductModelMock;

    beforeEach(() => {
        jest.clearAllMocks();

        ProductModel = PMExport as unknown as ProductModelMock;

        ProductModel.mockReset();
        ProductModel.find.mockReset();
        ProductModel.findById.mockReset();
        ProductModel.findByIdAndUpdate.mockReset();
        ProductModel.findByIdAndDelete.mockReset();

        repo = new ProductRepository();
    });

    describe("getAll", () => {
        it("applies category filter, sort(asc) and pagination", async () => {
            const input = {category: "laptops", sort: "asc", page: 2, limit: 5} as any;
            const data = [
                { _id: "64b7f5c1a1f2b4e89c0d1234", name: "Apple MacBook Air M2", price: 1199, stock: 15, category: "laptops" },
                { _id: "64b7f5c1a1f2b4e89c0d1235", name: "Dell XPS 13", price: 999, stock: 8, category: "laptops" },
                { _id: "64b7f5c1a1f2b4e89c0d1236", name: "Sony WH-1000XM5 Headphones", price: 399, stock: 25, category: "audio" },
                { _id: "64b7f5c1a1f2b4e89c0d1237", name: "Samsung Galaxy S23 Ultra", price: 1299, stock: 10, category: "smartphones" }
            ];

            const chain = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValueOnce(data)
            };
            ProductModel.find.mockReturnValue(chain);

            const result = await repo.getAll(input);

            expect(ProductModel.find).toHaveBeenCalledWith({category: "laptops"});
            expect(chain.sort).toHaveBeenCalledWith({price: 1});
            expect(chain.skip).toHaveBeenCalledWith((2 - 1) * 5);
            expect(chain.limit).toHaveBeenCalledWith(5);
            expect(result).toEqual(data);
        });
    });

    describe("getById", () => {
        it("returns product when found", async () => {
            const prod = [
                { _id: "64b7f5c1a1f2b4e89c0d1234", name: "Apple MacBook Air M2", price: 1199, stock: 15, category: "laptops" },
                { _id: "64b7f5c1a1f2b4e89c0d1235", name: "Dell XPS 13", price: 999, stock: 8, category: "laptops" },
                { _id: "64b7f5c1a1f2b4e89c0d1236", name: "Sony WH-1000XM5 Headphones", price: 399, stock: 25, category: "audio" },
                { _id: "64b7f5c1a1f2b4e89c0d1237", name: "Samsung Galaxy S23 Ultra", price: 1299, stock: 10, category: "smartphones" }
            ];
            ProductModel.findById.mockResolvedValueOnce(prod);

            const result = await repo.getById("64b7f5c1a1f2b4e89c0d1234");

            expect(ProductModel.findById).toHaveBeenCalledWith("64b7f5c1a1f2b4e89c0d1234");
            expect(result).toEqual(prod);
        });

        it("returns null when product not found", async () => {
            ProductModel.findById.mockResolvedValueOnce(null);

            const result = await repo.getById("noId");

            expect(ProductModel.findById).toHaveBeenCalledWith("noId");
            expect(result).toBeNull();
        });
    });

    describe("create", () => {
        it("returns saved entity", async () => {
            const dto = { name: "iPhone 14 Pro", price: 1099, stock: 12, category: "smartphones" };
            const saved = { _id: "64b7f5c1a1f2b4e89c0d1238", ...dto };

            ProductModel.mockImplementation(() => ({
                save: jest.fn().mockResolvedValueOnce(saved)
            }));

            const result = await repo.create(dto);

            expect(ProductModel).toHaveBeenCalledTimes(1);
            expect(ProductModel).toHaveBeenCalledWith(dto);
            expect(result).toEqual(saved);
        });
    });

    describe("delete", () => {
        it("returns true when deletion succeeds", async () => {
            ProductModel.findByIdAndDelete.mockResolvedValueOnce({ _id: "64b7f5c1a1f2b4e89c0d1238" });

            const result = await repo.delete("64b7f5c1a1f2b4e89c0d1238");

            expect(ProductModel.findByIdAndDelete).toHaveBeenCalledWith("64b7f5c1a1f2b4e89c0d1238");
            expect(result).toBe(true);
        });

        it("returns false when document is missing", async () => {
            ProductModel.findByIdAndDelete.mockResolvedValueOnce(null);

            const result = await repo.delete("missingId");

            expect(ProductModel.findByIdAndDelete).toHaveBeenCalledWith("missingId");
            expect(result).toBe(false);
        });
    });
})