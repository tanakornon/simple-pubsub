import { MachineRefillEvent } from "./events/MachineRefillEvent";
import { MachineSaleEvent } from "./events/MachineSaleEvent";
import { IEvent } from "./interfaces/IEvent";

export const randomMachine = (): string => {
    const random = Math.random() * 4;
    if (random < 1) {
        return "001";
    } else if (random < 2) {
        return "002";
    } else if (random < 3) {
        return "003";
    }
    return "004";
};

export const eventGenerator = (): IEvent => {
    const random = Math.random();
    if (random < 0.5) {
        const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
        return new MachineSaleEvent(saleQty, randomMachine());
    }
    const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
    return new MachineRefillEvent(refillQty, randomMachine());
};
