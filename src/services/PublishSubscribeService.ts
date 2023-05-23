import { IEvent } from "../interfaces/IEvent";
import { IPublishSubscribeService } from "../interfaces/IPublishSubscribeService";
import { ISubscriber } from "../interfaces/ISubscriber";

export class PublishSubscribeService implements IPublishSubscribeService {
    private subscribers: Record<string, ISubscriber[]> = {};

    publish(event: IEvent): void {
        const eventType = event.type();

        if (this.subscribers[eventType]) {
            for (const subscriber of this.subscribers[eventType]) {
                subscriber.handle(event);
            }
        }
    }

    subscribe(eventType: string, subscriber: ISubscriber): void {
        if (!this.subscribers[eventType]) {
            this.subscribers[eventType] = [];
        }
        this.subscribers[eventType].push(subscriber);
    }

    unsubscribe(eventType: string, subscriber: ISubscriber): void {
        const subscribers = this.subscribers[eventType];

        if (subscribers) {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
        }
    }
}
