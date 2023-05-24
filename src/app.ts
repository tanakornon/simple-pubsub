import { IPublishSubscribeService } from "./interfaces/IPublishSubscribeService";
import { DependencyContainer } from "./models/DependencyContainer";
import { Machine } from "./models/Machine";
import { PublishSubscribeService } from "./services/PublishSubscribeService";
import { MachineRefillSubscriber } from "./subscribers/MachineRefillSubscriber";
import { MachineSaleSubscriber } from "./subscribers/MachineSaleSubscriber";
import { StockLevelOkSubscriber } from "./subscribers/StockLevelOkSubscriber";
import { StockWarningSubscriber } from "./subscribers/StockWarningSubscriber";
import { eventGenerator } from "./utils";

async function main() {
    // create 3 machines with a quantity of 10 stock
    const machines: Record<string, Machine> = {
        "001": new Machine("001"),
        "002": new Machine("002"),
        "003": new Machine("003"),
    };

    // create the PubSub service
    const pubSubService: IPublishSubscribeService =
        new PublishSubscribeService();

    DependencyContainer.registerService("pubSubService", pubSubService);

    // create a machine sale event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber = new MachineSaleSubscriber(machines);
    const refillSubscriber = new MachineRefillSubscriber(machines);
    const stockWarningSubscriber = new StockWarningSubscriber(machines);
    const stockLevelOkSubscriber = new StockLevelOkSubscriber(machines);

    pubSubService.subscribe("sale", saleSubscriber);
    pubSubService.subscribe("refill", refillSubscriber);
    pubSubService.subscribe("lowStockWarning", stockWarningSubscriber);
    pubSubService.subscribe("stockLevelOk", stockLevelOkSubscriber);

    // create 5 random events
    const events = Array.from({ length: 5 }, () => eventGenerator());

    // publish the events
    // events.map(pubSubService.publish.bind(pubSubService));
    for (const event of events) {
        pubSubService.publish(event);
        // console.log(event, machines);
    }

    return 0;
}

main().then(console.log).catch(console.error);
