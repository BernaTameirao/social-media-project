import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards
} from '@nestjs/common';

import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("follows")
export class FollowsController {
    constructor(
        private readonly followsService: FollowsService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    createNewFollowing(
        @Req() req,
        @Body() body: CreateFollowDto
    ) {
        return this.followsService.createNewFollowing(
            req.user.id,
            body.followed_id
        );
    }
}