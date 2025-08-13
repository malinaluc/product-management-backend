export const ProductModel: any = jest.fn();

ProductModel.find = jest.fn();
ProductModel.findById = jest.fn();
ProductModel.findByIdAndUpdate = jest.fn();
ProductModel.findByIdAndDelete = jest.fn();