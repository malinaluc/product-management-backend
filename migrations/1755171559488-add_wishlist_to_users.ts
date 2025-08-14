import {models} from "./config";
import {connect} from "./config/index";
import mongoose from "mongoose";

export const up = async (): Promise<void> => {
    await connect();
    const users = mongoose.connection.collection("users");

    await users.updateMany(
        { wishlist: { $exists: false } },
        { $set: { wishlist: [] } }
    );
};

export const down = async (): Promise<void> => {
    await connect();
    const users = mongoose.connection.collection("users");

    await users.updateMany(
        { wishlist: { $exists: true } },
        { $unset: { wishlist: "" } }
    );
};