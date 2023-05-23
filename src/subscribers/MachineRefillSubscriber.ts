import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { INotifier } from "../interfaces/INotifier";
import { IPublishSubscribeService } from "../interfaces/IPublishSubscribeService";
import { ISubscriber } from "../interfaces/ISubscriber";
import { Machine } from "../models/Machine";

export class MachineRefillSubscriber implements ISubscriber, INotifier {
    public machines: Record<string, Machine>;
    public service: IPublishSubscribeService | undefined;

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
                this.notify(stockLevelOkEvent);
            }
        }
    }

    register(service: IPublishSubscribeService): void {
        this.service = service;
    }

    notify(event: StockLevelOkEvent): void {
        if (this.service) {
            this.service.publish(event);
        }
    }
}
