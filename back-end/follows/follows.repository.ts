import {
    Injectable,
    Inject
} from '@nestjs/common';

import { Pool } from 'pg';

@Injectable()
export class FollowsRepository{
    constructor(
        @Inject('PG_POOL') private readonly pool: Pool
    ) {}

    async createNewFollowing_Check(
        follower_id: number,
        followed_id: number
    ) {
        const result = await this.pool.query(
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

        return result.rows;
    }

    async createNewFollowing_Follow(
        follower_id: number,
        followed_id: number
    ) {

        const result = await this.pool.query(
            `
            INSERT INTO follows
                (follower_id, followed_id)
            VALUES ($1, $2)
            RETURNING *
            `,
            [follower_id, followed_id]
        );

        return result.rows;
    }

    async createNewFollowing_Unfollow(
        follower_id: number,
        followed_id: number
    ) {

        const result = await this.pool.query(
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

        return result.rows;
    }
}