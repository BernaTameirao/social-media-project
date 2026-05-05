import { Module } from '@nestjs/common';

import { AccountModule } from 'account/account.module';
import { AuthModule } from 'auth/auth.module';
import { StaticModule } from 'common/static.module';
import { FollowsModule } from 'follows/follows.module';
import { PostsModule } from 'posts/posts.module';

@Module({
  imports: [AccountModule, AuthModule, FollowsModule, PostsModule, StaticModule],
})
export class AppModule {}
