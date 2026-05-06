import {
    Injectable,
    InternalServerErrorException,
    Inject
} from '@nestjs/common';

import { Pool } from 'pg';

@Injectable()
export class PostsService {
    constructor(
        @Inject('PG_POOL') private readonly pool: Pool
    ) {}

    async getPosts(
        limitQuery: string
    ) {
        try {
            const limit = parseInt(limitQuery) || 20;

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
        } catch (err) {

            throw new InternalServerErrorException(
                "Get Posts operation failed"
            );
        }
    }

    async getUserFeed (
        user_id: number,
        limitQuery: string
    ) {
        try {
            const limit = parseInt(limitQuery) || 20;

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
                    )
                ORDER BY posts.created_at DESC
                LIMIT $1;
                `,
                [limit, user_id]
            );

            return result.rows;
        } catch (err) {

            throw new InternalServerErrorException(
                "Get User Feed operation failed"
            );
        }
    }

    async createPost(
        user_id: number,
        content: string
    ) {
        try {

            const insertion = await this.pool.query(
                "INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *",
                [content, user_id]
            );

            const postId = insertion.rows[0].id;

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

            return result.rows[0];
        } catch (err) {
            throw new InternalServerErrorException(
                "Create Post operation failed"
            );
        }
    }
}