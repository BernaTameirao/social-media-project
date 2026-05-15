import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DomainEventsService {

    constructor(
        private readonly eventEmitter: EventEmitter2,
    ) {}

    publish(event: string, payload: any) {
        this.eventEmitter.emit(event, payload);
    }
}