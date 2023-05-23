import { IEvent } from "./IEvent";
import { IPublishSubscribeService } from "./IPublishSubscribeService";

export interface INotifier {
    register(service: IPublishSubscribeService): void;
    notify(event: IEvent): void;
}
