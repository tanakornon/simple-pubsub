import { IEvent } from "./IEvent";
import { ISubscriber } from "./ISubscriber";

export interface IPublishSubscribeService {
    publish(event: IEvent): void;
    subscribe(type: string, subscriber: ISubscriber): void;
    unsubscribe(eventType: string, subscriber: ISubscriber): void;
}
