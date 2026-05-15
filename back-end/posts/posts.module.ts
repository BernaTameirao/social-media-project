import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { DatabaseModule } from 'database/database.module';
import { PostsRepository } from './posts.repository';

@Module({
    controllers: [PostsController],
    providers: [PostsService, PostsRepository],
    imports: [DatabaseModule]
})
export class PostsModule {}