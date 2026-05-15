import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { DatabaseModule } from 'database/database.module';
import { NotificationsRepository } from './notifications.repository';
import { UserFollowedListener } from './listeners/user-followed.listener';

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsRepository, UserFollowedListener],
    imports: [DatabaseModule]
})
export class NotificationsModule {}