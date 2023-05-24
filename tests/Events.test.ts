import { MachineRefillEvent } from "../src/events/MachineRefillEvent";
import { MachineSaleEvent } from "../src/events/MachineSaleEvent";
import { IPublishSubscribeService } from "../src/interfaces/IPublishSubscribeService";
import { DependencyContainer } from "../src/models/DependencyContainer";
import { Machine } from "../src/models/Machine";
import { PublishSubscribeService } from "../src/services/PublishSubscribeService";
import { MachineRefillSubscriber } from "../src/subscribers/MachineRefillSubscriber";
import { MachineSaleSubscriber } from "../src/subscribers/MachineSaleSubscriber";
import { StockLevelOkSubscriber } from "../src/subscribers/StockLevelOkSubscriber";
import { StockWarningSubscriber } from "../src/subscribers/StockWarningSubscriber";

describe("Events", () => {
    let pubSubService: IPublishSubscribeService;
    let machine: Machine;
    let refillSubscriber: MachineRefillSubscriber;
    let saleSubscriber: MachineSaleSubscriber;
    let stockLevelOKSubscriber: StockLevelOkSubscriber;
    let stockWarningSubscriber: StockWarningSubscriber;

    beforeEach(() => {
        pubSubService = new PublishSubscribeService();

        DependencyContainer.registerService("pubSubService", pubSubService);

        machine = new Machine("001");

        refillSubscriber = new MachineRefillSubscriber({ "001": machine });
        saleSubscriber = new MachineSaleSubscriber({ "001": machine });
        stockLevelOKSubscriber = new StockLevelOkSubscriber({ "001": machine });
        stockWarningSubscriber = new StockWarningSubscriber({ "001": machine });

        pubSubService.subscribe("refill", refillSubscriber);
        pubSubService.subscribe("sale", saleSubscriber);
        pubSubService.subscribe("stockLevelOk", stockLevelOKSubscriber);
        pubSubService.subscribe("lowStockWarning", stockWarningSubscriber);
    });

    it("should handle MachineRefillEvent and increase the stock level", () => {
        const refillEvent = new MachineRefillEvent(3, "001");

        pubSubService.publish(refillEvent);

        expect(machine.stockLevel).toBe(13);
    });

    it("should handle MachineSaleEvent and decrease the stock level", () => {
        const saleEvent = new MachineSaleEvent(2, "001");

        pubSubService.publish(saleEvent);

        expect(machine.stockLevel).toBe(8);
    });

    it("should fire LowStockWarningEvent when stock level drops below 3", () => {
        const saleEvent = new MachineSaleEvent(2, "001");

        pubSubService.publish(saleEvent);

        expect(machine.stockWarningFired).toBe(false);

        machine.stockLevel = 2;

        pubSubService.publish(saleEvent);

        expect(machine.stockWarningFired).toBe(true);
    });

    it("should fire StockLevelOkEvent when stock level hits 3 or above", () => {
        const refillEvent = new MachineRefillEvent(2, "001");

        pubSubService.publish(refillEvent);

        expect(machine.stockLevelOkFired).toBe(true);

        machine.stockLevel = 2;
        machine.stockLevelOkFired = false;

        pubSubService.publish(refillEvent);

        expect(machine.stockLevelOkFired).toBe(true);
    });

    it("should fire LowStockWarningEvent only once when crossing the threshold", () => {
        const saleEvent = new MachineSaleEvent(5, "001");
        const subscriber = jest.spyOn(stockWarningSubscriber, "handle");

        for (let i = 0; i < 5; i++) {
            pubSubService.publish(saleEvent);
        }

        expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("should fire StockLevelOkEvent only once when crossing the threshold", () => {
        const refillEvent = new MachineRefillEvent(5, "001");
        const subscriber = jest.spyOn(stockLevelOKSubscriber, "handle");

        machine.stockLevel = 2;
        machine.stockLevelOkFired = false;

        for (let i = 0; i < 5; i++) {
            pubSubService.publish(refillEvent);
        }

        expect(subscriber).toHaveBeenCalledTimes(1);
    });
});
