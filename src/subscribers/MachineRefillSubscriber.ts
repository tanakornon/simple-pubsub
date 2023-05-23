import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { ISubscriber } from "../interfaces/ISubscriber";
import { Machine } from "../models/Machine";
import eventBus from "../services/PublishSubscribeService";

export class MachineRefillSubscriber implements ISubscriber {
    public machines: Record<string, Machine>;

    constructor(machines: Record<string, Machine>) {
        this.machines = machines;
    }

    handle(event: MachineRefillEvent): void {
        const machineId = event.machineId();
        const refillQuantity = event.getRefillQuantity();

        const machine = this.machines[machineId];

        if (!machine) {
            return;
        }

        machine.stockLevel += refillQuantity;

        if (machine.stockLevel >= 3) {
            const stockLevelOkEvent = new StockLevelOkEvent(machineId);

            if (!machine.stockLevelOkFired) {
                machine.stockLevelOkFired = true;
                machine.stockWarningFired = false;
                eventBus.publish(stockLevelOkEvent);
            }
        }
    }
}
