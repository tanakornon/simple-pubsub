import { Machine } from "./models/Machine";
import eventBus from "./services/PublishSubscribeService";
import { MachineRefillSubscriber } from "./subscribers/MachineRefillSubscriber";
import { MachineSaleSubscriber } from "./subscribers/MachineSaleSubscriber";
import { StockLevelOkSubscriber } from "./subscribers/StockLevelOkSubscriber";
import { StockWarningSubscriber } from "./subscribers/StockWarningSubscriber";
import { eventGenerator } from "./utils";

async function main() {
    // create 3 machines with a quantity of 10 stock
    const machines: Machine[] = [
        new Machine("001"),
        new Machine("002"),
        new Machine("003"),
    ];

    // create the PubSub service
    // const pubSubService: IPublishSubscribeService =
    //     new PublishSubscribeService();

    // create a machine sale event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber = new MachineSaleSubscriber(machines);
    const refillSubscriber = new MachineRefillSubscriber(machines);
    const stockLevelOkSubscriber = new StockLevelOkSubscriber(machines);
    const stockWarningSubscriber = new StockWarningSubscriber(machines);

    eventBus.subscribe("sale", saleSubscriber);
    eventBus.subscribe("refill", refillSubscriber);
    eventBus.subscribe("stockLevelOk", stockLevelOkSubscriber);
    eventBus.subscribe("lowStockWarning", stockWarningSubscriber);

    // create 5 random events
    const events = Array.from({ length: 100 }, () => eventGenerator());

    // publish the events
    // events.map(pubSubService.publish.bind(pubSubService));
    for (const event of events) {
        eventBus.publish(event);
        // console.log(event, machines);
    }

    return 0
}

main().then(console.log).catch(console.error);
