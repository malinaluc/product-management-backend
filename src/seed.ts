import { connectToDatabase } from "./config/environment";
import { ProductModel } from "./models/product.model";
import { UserModel } from "./models/user.model";
import { OrderModel } from "./models/order.model";
import bcrypt from "bcryptjs";

async function run() {
    await connectToDatabase();

    await ProductModel.deleteMany({});
    await UserModel.deleteMany({});
    await OrderModel.deleteMany({});

    const products = await ProductModel.insertMany([
        { name: "Laptop", category: "electronics", price: 4200, stock: 12 },
        { name: "Mouse", category: "electronics", price: 80, stock: 200 },
        { name: "Chair", category: "furniture", price: 350, stock: 50 }
    ]);

    const password = await bcrypt.hash("Admin123!", 10);
    const user = await UserModel.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@ex.com",
        password,
        role: "admin",
        banned: false,
    });

    await OrderModel.create({
        userId: String(user._id),
        products: [
            { id: String(products[0]!._id), quantity: 1 },
            { id: String(products[1]!._id), quantity: 2 }
        ],
        totalAmount: products[0]!.price * 1 + products[1]!.price * 2
    });

    console.log("Seed done");
    process.exit(0);
}

run().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});