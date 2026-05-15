import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'events/events.constants';
import { NotificationsService } from 'notifications/notifications.service';

@Injectable()
export class UserFollowedListener {
    constructor (
        private readonly notificationsService: NotificationsService
    ) {}

    @OnEvent(EVENTS.USER_FOLLOWED)
    async handle(
        payload: any
    ) {

        try{
            await this.notificationsService.createFollowNotification(
               payload.recipient_id,
               payload.actor_id
            );
        } catch (err) {

            console.log(new InternalServerErrorException(
                "User Followed Event operation failed"
            ))
        }
    }
}