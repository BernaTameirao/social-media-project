import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { DatabaseModule } from 'database/database.module';

@Module({
    controllers: [AccountController],
    providers: [AccountService],
    imports: [DatabaseModule]
})
export class AccountModule {}