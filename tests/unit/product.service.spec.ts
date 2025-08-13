import {ProductService} from "../../src/services/product.service";
import {ProductRepository} from "../../src/repositories/product.repository";

jest.mock("../../src/repositories/product.repository");

type RepoMock = {
    getAll: jest.Mock;
    getById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
};

describe("Product Service", () => {
    let service: ProductService;
    let repoMock: RepoMock;

    beforeEach(() => {
        jest.clearAllMocks();

        service = new ProductService();

        const PR = ProductRepository as unknown as jest.MockedClass<typeof ProductRepository>;
        const ctorCall = PR.mock.results[0];

        if (!ctorCall || ctorCall.type !== "return" || !ctorCall.value) {
            throw new Error("Repository mock return value not available");
        }

        repoMock = ctorCall.value as RepoMock;
    });

    describe("getAll", () => {
        it.each([
            { _id: "64b7f5c1a1f2b4e89c0d1234", name: "Apple MacBook Air M2", price: 1199, stock: 15, category: "laptops" },
            { _id: "64b7f5c1a1f2b4e89c0d1235", name: "Dell XPS 13", price: 999, stock: 8, category: "laptops" },
            { _id: "64b7f5c1a1f2b4e89c0d1236", name: "Sony WH-1000XM5 Headphones", price: 399, stock: 25, category: "audio" },
            { _id: "64b7f5c1a1f2b4e89c0d1237", name: "Samsung Galaxy S23 Ultra", price: 1299, stock: 10, category: "smartphones" }
        ])
        ("Returns list and forwards params correctly %j", async (input: any) => {
            const data = [{ _id: "1" }, { _id: "2" }];
            repoMock.getAll.mockResolvedValueOnce(data);

            const result = await service.getAll(input);

            expect(repoMock.getAll).toHaveBeenCalledWith(input);
            expect(result).toEqual(data);
        });

        it("Errors from repository", async () => {
            const err = new Error("db");
            repoMock.getAll.mockRejectedValueOnce(err);
            await expect(service.getAll({} as any)).rejects.toThrow(err);
        });
    });

    describe("getById", () => {
        it("Returns product when it exists", async () => {
            const prod = [
                { _id: "64b7f5c1a1f2b4e89c0d1234", name: "Apple MacBook Air M2", price: 1199, stock: 15, category: "laptops" },
                { _id: "64b7f5c1a1f2b4e89c0d1235", name: "Dell XPS 13", price: 999, stock: 8, category: "laptops" },
                { _id: "64b7f5c1a1f2b4e89c0d1236", name: "Sony WH-1000XM5 Headphones", price: 399, stock: 25, category: "audio" },
                { _id: "64b7f5c1a1f2b4e89c0d1237", name: "Samsung Galaxy S23 Ultra", price: 1299, stock: 10, category: "smartphones" }
            ];
            repoMock.getById.mockResolvedValueOnce(prod);

            const result = await service.getById("64b7f5c1a1f2b4e89c0d1234");

            expect(repoMock.getById).toHaveBeenCalledWith("64b7f5c1a1f2b4e89c0d1234");
            expect(result).toEqual(prod);
        });

        it("Returns null when product is missing", async () => {
            repoMock.getById.mockResolvedValueOnce(null);

            const result = await service.getById("noId");

            expect(repoMock.getById).toHaveBeenCalledWith("noId");
            expect(result).toBeNull();
        });

        it("Errors from repository", async () => {
            const err = new Error("db");
            repoMock.getById.mockRejectedValueOnce(err);
            await expect(service.getById("x")).rejects.toThrow(err);
        });
    });

    describe("create", () => {
        it("Creates a new product and returns the entity", async () => {
            const dto = { name: "iPhone 14 Pro", price: 1099, stock: 12, category: "smartphones" };
            const saved = { _id: "64b7f5c1a1f2b4e89c0d1238", ...dto };
            repoMock.create.mockResolvedValueOnce(saved);

            const result = await service.create(dto);
            expect(repoMock.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(saved);
        });

        it("Errors from repository", async () => {
            const err = new Error("db");
            repoMock.create.mockRejectedValueOnce(err);
            await expect(service.create({} as any)).rejects.toThrow(err);
        });
    });

    describe("delete", () => {
        it("Returns true when success on delete ", async () => {
            repoMock.delete.mockResolvedValueOnce(true);

            const result = await service.delete("64b7f5c1a1f2b4e89c0d1238");

            expect(repoMock.delete).toHaveBeenCalledWith("64b7f5c1a1f2b4e89c0d1238");
            expect(result).toBe(true);
        });

        it("Returns false when product is missing", async () => {
            repoMock.delete.mockResolvedValueOnce(false);

            const result = await service.delete("missingId");

            expect(result).toBe(false);
        });

        it("Errors from repository", async () => {
            const err = new Error("db");
            repoMock.delete.mockRejectedValueOnce(err);
            await expect(service.delete("x")).rejects.toThrow(err);
        });
    });
});