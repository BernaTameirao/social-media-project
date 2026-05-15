import {
    Controller,
    Get,
    Req,
    UseGuards
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("notifications")
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    getNotifications(
        @Req() req
    ) {
        return this.notificationsService.getNotifications(
            req.user.id,
            req.query.limit
        )
    }
}