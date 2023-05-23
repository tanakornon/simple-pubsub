import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { ISubscriber } from "../interfaces/ISubscriber";
import { Machine } from "../models/Machine";

export class StockWarningSubscriber implements ISubscriber {
    public machines: Record<string, Machine>;

    constructor(machines: Record<string, Machine>) {
        this.machines = machines;
    }

    handle(event: StockLevelOkEvent): void {
        const machineId = event.machineId();

        const machine = this.machines[machineId];

        if (!machine) {
            return;
        }

        console.warn(
            `WARN: Machine ${machine.id} stock is low. StockLevel: ${machine.stockLevel}`
        );
    }
}
