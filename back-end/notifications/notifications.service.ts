import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';

import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly notificationsRepository: NotificationsRepository
    ) {}

    async getNotifications(
        user_id: number,
        limitQuery: string
    ) {
        const limit = parseInt(limitQuery) || 10;

        try{
            const result = await this.notificationsRepository.getNotifications(
                user_id,
                limit
            );

            return result;
        } catch (err) {

            throw new InternalServerErrorException(
                "Get Notifications operation failed"
            )
        }
    }

    async createFollowNotification(
        recipient_id: number,
        actor_id: number
    ) {

        if(recipient_id === actor_id){
            return;
        }

        const result = this.notificationsRepository.createFollowNotification(
            recipient_id,
            actor_id,
            "USER_FOLLOWED"
        )

        return result[0];
    }
}