import {
    Injectable,
    BadRequestException,
    InternalServerErrorException
} from '@nestjs/common';

import { DomainEventsService } from 'events/domain-events.service';
import { EVENTS } from 'events/events.constants';
import { FollowsRepository } from './follows.repository';

@Injectable()
export class FollowsService {
    constructor(
        private readonly followsRepository: FollowsRepository,
        private readonly domainEvents: DomainEventsService
    ) {}

    async createNewFollowing(
        follower_id: number,
        followed_id: number
    ) {
        try {
            if (follower_id === followed_id) {
                throw new BadRequestException(
                    "Follower and followed can't be the same user"
                );
            }

            const check = await this.followsRepository.createNewFollowing_Check(
                follower_id,
                followed_id
            );

            let result;

            if (check.length === 0) {
                result = await this.followsRepository.createNewFollowing_Follow(
                    follower_id,
                    followed_id
                )
            } else {
                result = await this.followsRepository.createNewFollowing_Unfollow(
                    follower_id,
                    followed_id
                )
            }

            this.domainEvents.publish(
                EVENTS.USER_FOLLOWED,
                {
                    actor_id: follower_id,
                    recipient_id: followed_id,
                    type: "USER_FOLLOWED"
                }
            )

            return result[0];

        } catch (err) {

            throw new InternalServerErrorException(
                'Follow operation failed'
            );
        }
    }
}