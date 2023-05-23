import { LowStockWarningEvent } from "../events/LowStockWarningEvent";
import { MachineSaleEvent } from "../events/MachineSaleEvent";
import { INotifier } from "../interfaces/INotifier";
import { IPublishSubscribeService } from "../interfaces/IPublishSubscribeService";
import { ISubscriber } from "../interfaces/ISubscriber";
import { Machine } from "../models/Machine";

export class MachineSaleSubscriber implements ISubscriber, INotifier {
    public machines: Record<string, Machine>;
    public service: IPublishSubscribeService | undefined;

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
            return;
        }

        machine.stockLevel -= soldQuantity;

        if (machine.stockLevel < 3) {
            const lowStockWarningEvent = new LowStockWarningEvent(machineId);

            if (!machine.stockWarningFired) {
                machine.stockWarningFired = true;
                machine.stockLevelOkFired = false;
                this.notify(lowStockWarningEvent);
            }
        }
    }

    register(service: IPublishSubscribeService): void {
        this.service = service;
    }

    notify(event: LowStockWarningEvent): void {
        if (this.service) {
            this.service.publish(event);
        }
    }
}
