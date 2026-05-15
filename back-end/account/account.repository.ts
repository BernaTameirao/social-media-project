import {
    Injectable,
    Inject
} from '@nestjs/common';

import { Pool } from 'pg';

@Injectable()
export class AccountRepository{

    constructor(
        @Inject('PG_POOL') private readonly pool: Pool
    ) {}

    async getAccountInfo_UserInfo(
        username: string
    ) {
        const result = await this.pool.query(
            `
            SELECT 
                users.id,
                users.username, 
                users.image,
                users.description,
        
                (
                  SELECT COUNT(*)
                  FROM follows
                  WHERE followed_id = users.id AND deleted_at IS NULL
                ) AS followers_count,
                (
                  SELECT COUNT(*)
                  FROM follows
                  WHERE follower_id = users.id AND deleted_at is NULL
                ) AS following_count
        
              FROM users
              WHERE username = $1
            `,
            [username]
        );

        return result.rows;
    }

    async getAccountInfo_Posts(
        username: string,
        limit: number
    ) {
        const result = await this.pool.query(
            `
            SELECT
                posts.content,
                users.username
            FROM posts JOIN users
            ON posts.user_id = users.id 
            WHERE users.username = $1
            ORDER BY posts.created_at DESC
            LIMIT $2
            `,
            [username, limit]
        );

        return result.rows;
    }

    async changeAccountDesc(
        user_id: number,
        new_desc: string
    ) {

        const result = await this.pool.query(
            `
            UPDATE users
            SET description = $1
            WHERE id = $2
            RETURNING description
            `,
            [new_desc, user_id]
        );

        return result.rows;
    }

    async changeProfileImage(
        user_id: number,
        imagePath: string
    ) {

        const result = await this.pool.query(
            `
            UPDATE users
            SET image = $1
            WHERE id = $2
            RETURNING image
            `,
            [imagePath, user_id]
        );

        return result.rows;
    }
}