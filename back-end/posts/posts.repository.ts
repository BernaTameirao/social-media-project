import {
    Injectable,
    Inject
} from '@nestjs/common';

import { Pool } from 'pg';

@Injectable()
export class PostsRepository{
    constructor(
        @Inject('PG_POOL') private readonly pool: Pool
    ) {}

    async getPosts(
        limit: number
    ) {
        const result = await this.pool.query(
            `
            SELECT 
                posts.id,
                posts.content,
                posts.created_at,
                users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
            LIMIT $1
            `,
            [limit]
        );

        return result.rows;
    }

    async getUserFeed(
        user_id: number,
        limit: number
    ) {
        const result = await this.pool.query(
            `
            SELECT 
                posts.id,
                posts.content,
                posts.created_at,
                users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE 
                posts.user_id = $2
                OR EXISTS (
                    SELECT 1 
                    FROM follows 
                    WHERE follows.followed_id = posts.user_id
                    AND follows.follower_id = $2
                    AND follows.deleted_at IS NULL
                )
            ORDER BY posts.created_at DESC
            LIMIT $1;
            `,
            [limit, user_id]
        );
        
        return result.rows;
    }

    async createPost_Insert(
        user_id: number,
        content: string
    ) {
        const result = await this.pool.query(
            "INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *",
            [content, user_id]
        );

        return result.rows;
    }

    async createPost_Select(
        postId: number
    ) {
        const result = await this.pool.query(
            `
            SELECT 
                posts.id,
                posts.content,
                posts.created_at,
                users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = $1
            `,
            [postId]
        );

        return result.rows;
    }
}