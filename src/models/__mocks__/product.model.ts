export const ProductModel = jest.fn();

(ProductModel as any).find = jest.fn();
(ProductModel as any).findById = jest.fn();
(ProductModel as any).findByIdAndUpdate = jest.fn();
(ProductModel as any).findByIdAndDelete = jest.fn();
(ProductModel as any).prototype.save = jest.fn();