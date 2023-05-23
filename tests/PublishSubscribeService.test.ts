import { MachineSaleEvent } from "../src/events/MachineSaleEvent";
import { IPublishSubscribeService } from "../src/interfaces/IPublishSubscribeService";
import { Machine } from "../src/models/Machine";
import { PublishSubscribeService } from "../src/services/PublishSubscribeService";
import { MachineSaleSubscriber } from "../src/subscribers/MachineSaleSubscriber";

describe("PublishSubscribeService", () => {
    let publishSubscribeService: IPublishSubscribeService;
    let machine: Machine;
    let saleSubscriber: MachineSaleSubscriber;

    beforeEach(() => {
        publishSubscribeService = new PublishSubscribeService();

        machine = new Machine("001");

        saleSubscriber = new MachineSaleSubscriber({ "001": machine });

        publishSubscribeService.subscribe("sale", saleSubscriber);
    });

    it("should notify subscribers when publishing an event", () => {
        const saleEvent = new MachineSaleEvent(1, "001");

        publishSubscribeService.publish(saleEvent);

        expect(machine.stockLevel).toBe(9);
    });

    it("should not notify unsubscribed subscribers when publishing an event", () => {
        const anotherMachine = new Machine("002");
        const anotherSaleSubscriber = new MachineSaleSubscriber({
            "002": anotherMachine,
        });

        publishSubscribeService.subscribe("sale", anotherSaleSubscriber);

        const saleEvent = new MachineSaleEvent(1, "001");

        publishSubscribeService.publish(saleEvent);

        expect(machine.stockLevel).toBe(9);
        expect(anotherMachine.stockLevel).toBe(10);
    });

    it("should unsubscribe subscribers from receiving events", () => {
        publishSubscribeService.unsubscribe("sale", saleSubscriber);

        const saleEvent = new MachineSaleEvent(1, "001");

        publishSubscribeService.publish(saleEvent);

        expect(machine.stockLevel).toBe(10);
    });
});
