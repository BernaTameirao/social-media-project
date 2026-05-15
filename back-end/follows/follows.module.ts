import { Module } from '@nestjs/common';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { DatabaseModule } from 'database/database.module';
import { FollowsRepository } from './follows.repository';
import { DomainEventsService } from 'events/domain-events.service';
import { EventsModule } from 'events/events.module';

@Module({
    controllers: [FollowsController],
    providers: [FollowsService, FollowsRepository, DomainEventsService],
    imports: [DatabaseModule, EventsModule]
})
export class FollowsModule {}