import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { IPublishSubscribeService } from "../interfaces/IPublishSubscribeService";
import { ISubscriber } from "../interfaces/ISubscriber";
import { DependencyContainer } from "../models/DependencyContainer";
import { Machine } from "../models/Machine";

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
                DependencyContainer.resolve<IPublishSubscribeService>(
                    "pubSubService"
                ).publish(stockLevelOkEvent);
            }
        }
    }
}
