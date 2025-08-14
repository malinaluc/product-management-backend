import { connect} from "./index";

export const up = async (): Promise<void> => {
    await connect();

};

export const down = async (): Promise<void> => {
    await connect();

};