import { Module } from '@nestjs/common';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { DatabaseModule } from 'database/database.module';

@Module({
    controllers: [FollowsController],
    providers: [FollowsService],
    imports: [DatabaseModule]
})
export class FollowsModule {}