import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AccountModule } from 'account/account.module';
import { AuthModule } from 'auth/auth.module';
import { StaticModule } from 'common/static.module';
import { FollowsModule } from 'follows/follows.module';
import { NotificationsModule } from 'notifications/notifications.module';
import { PostsModule } from 'posts/posts.module';

@Module({
  imports: [
    AccountModule, 
    EventEmitterModule.forRoot(), 
    AuthModule, 
    FollowsModule, 
    PostsModule, 
    StaticModule,
    NotificationsModule
  ]
})
export class AppModule {}
