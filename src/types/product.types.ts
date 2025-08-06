export type Product = {
    id?: string;
    name: string;
    category : string;
    price: number;
    stock: number;
};

export type ProductDto = {
    name: string;
    category: string;
    price: number;
    stock: number;
};

export type OrderProduct = {
    id: string;
    quantity: number;
};

export type FilterProduct = {
    category?: string | undefined;
    sort?: "asc" | "desc" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
};