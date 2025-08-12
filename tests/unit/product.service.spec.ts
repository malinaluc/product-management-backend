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

        const PR = ProductRepository as unknown as jest.Mock;
        repoMock = PR.mock.instances[0] as RepoMock;

        if (!repoMock) {
            throw new Error("Repository mock instance not created");
        }
    });

    describe("getAll", () => {
        it.each([
            [{ category: "laptops", sort: "asc", page: 2, limit: 5 }],
            [{ category: "phones", sort: "desc", page: 1, limit: 10 }],
            [{}]
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
            const prod = { _id: "p1", name: "X", price: 1, stock: 1, category: "c" };
            repoMock.getById.mockResolvedValueOnce(prod);

            const result = await service.getById("p1");

            expect(repoMock.getById).toHaveBeenCalledWith("p1");
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
            const dto = {name: "NewProd", category: "NewCat", price: 100, stock: 200};
            const savedProduct = {_id: "p2", ...dto};
            repoMock.create.mockResolvedValueOnce(savedProduct);

            const result = await service.create(dto);
            expect(repoMock.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(savedProduct);
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

            const result = await service.delete("p9");

            expect(repoMock.delete).toHaveBeenCalledWith("p9");
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