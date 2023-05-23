import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { ISubscriber } from "../interfaces/ISubscriber";
import { Machine } from "../models/Machine";

export class StockLevelOkSubscriber implements ISubscriber {
    public machines: Machine[];

    constructor(machines: Machine[]) {
        this.machines = machines;
    }

    handle(event: StockLevelOkEvent): void {
        const machineId = event.machineId();

        const machine = this.machines.find(
            (machine) => machine.id == machineId
        );

        if (!machine) {
            return;
        }

        console.info(
            `INFO: Machine: ${machine.id} stock is ok. StockLevel: ${machine.stockLevel}`
        );
    }
}
