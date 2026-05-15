import { Module } from "@nestjs/common";
import { DomainEventsService } from "./domain-events.service";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [DomainEventsService],
  exports: [DomainEventsService], 
})
export class EventsModule {}