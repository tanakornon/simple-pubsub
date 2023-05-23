import { IEvent } from "./IEvent";

export interface ISubscriber {
    handle(event: IEvent): void;
}
