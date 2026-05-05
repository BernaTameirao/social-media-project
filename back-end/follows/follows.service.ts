import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
    Inject
} from '@nestjs/common';

import { Pool } from 'pg';

@Injectable()
export class FollowsService {
    constructor(
        @Inject('PG_POOL') private readonly pool: Pool
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

            const check = await this.pool.query(
                `
                SELECT deleted_at
                FROM follows
                WHERE follower_id = $1
                  AND followed_id = $2
                  AND deleted_at IS NULL
                LIMIT 1
                `,
                [follower_id, followed_id]
            );

            let result;

            if (check.rows.length === 0) {
                result = await this.pool.query(
                    `
                    INSERT INTO follows
                        (follower_id, followed_id)
                    VALUES ($1, $2)
                    RETURNING *
                    `,
                    [follower_id, followed_id]
                );
            } else {
                result = await this.pool.query(
                    `
                    UPDATE follows
                    SET deleted_at = NOW()
                    WHERE follower_id = $1
                      AND followed_id = $2
                      AND deleted_at IS NULL
                    RETURNING *
                    `,
                    [follower_id, followed_id]
                );
            }

            return result.rows[0];

        } catch (err) {

            throw new InternalServerErrorException(
                'Follow operation failed'
            );
        }
    }
}