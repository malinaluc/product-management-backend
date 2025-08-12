export const ProductRepository = jest.fn().mockImplementation(() => {
        return {
                getAll: jest.fn(),
                getById: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
        };
});