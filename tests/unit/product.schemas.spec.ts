import {createProductSchema, updateProductSchema} from "../../src/schemas/product.schema";

describe("Product Schemas", () => {
    describe("createProductSchema", () => {
        it("should validate a correct prdoduct", () => {
            const input = {
                name: "laptop",
                category: "electronics",
                price: 100,
                stock: 5
            };

            const result = createProductSchema.parse(input);
            expect(result).toEqual(input);
        });

        it("should trim strings", () => {
            const input = {
                name: "  laptop  ",
                category: "  electronics  ",
                price: 100,
                stock: 5
            };

            const result = createProductSchema.parse(input);
            expect(result.name).toBe("laptop");
            expect(result.category).toBe("electronics");
        });

        it("should throw an error if the product name is missing", () => {
            const input = {
                name: "",
                category: "  electronics  ",
                price: 1000,
                stock: 5
            };

            expect(() => createProductSchema.parse(input)).toThrow();
        });
    });

    describe("updateProductSchema", () => {
        it("should validate when at least one field is present", () => {
            const input = {
                price: 200
            };

            const result = updateProductSchema.parse(input);
            expect(result).toEqual(input);
        });

        it("should throw an error if the product price is negative", () => {
            const input = {
                price: -100
            };

            expect(() => updateProductSchema.parse(input)).toThrow();
        });

        it("should throw an error if the product stock is negative", () => {
            const input = {
                stock: -100
            };

            expect(() => updateProductSchema.parse(input)).toThrow();
        });

        it("should throw an error if the product stock is not int", () => {
            const input = {
                stock: 20.5
            };

            expect(() => updateProductSchema.parse(input)).toThrow();
        });
    });
});