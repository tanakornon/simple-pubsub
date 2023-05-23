import { LowStockWarningEvent } from "../events/LowStockWarningEvent";
import { MachineSaleEvent } from "../events/MachineSaleEvent";
import { ISubscriber } from "../interfaces/ISubscriber";
import { Machine } from "../models/Machine";
import eventBus from "../services/PublishSubscribeService";

export class MachineSaleSubscriber implements ISubscriber {
    public machines: Record<string, Machine>;

    constructor(machines: Record<string, Machine>) {
        this.machines = machines;
    }

    handle(event: MachineSaleEvent): void {
        const machineId = event.machineId();
        const soldQuantity = event.getSoldQuantity();

        const machine = this.machines[machineId];

        if (!machine) {
            return;
        }

        if (machine.stockLevel < soldQuantity) {
            // Prevent magical stockLevel (negative value)
            console.warn(
                `WARN: Machine: ${machine.id} not enough item to sold.`
            );
        }

        machine.stockLevel -= soldQuantity;

        if (machine.stockLevel < 3) {
            const lowStockWarningEvent = new LowStockWarningEvent(machineId);

            if (!machine.stockWarningFired) {
                machine.stockWarningFired = true;
                machine.stockLevelOkFired = false;
                eventBus.publish(lowStockWarningEvent);
            }
        }
    }
}
