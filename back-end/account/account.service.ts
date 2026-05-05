import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    Inject
} from '@nestjs/common';

import { Pool } from 'pg';

@Injectable()
export class AccountService {
    constructor(
        @Inject('PG_POOL') private readonly pool: Pool
    ) {}

    async getAccountInfo(
        username: string,
        limitQuery: string
    ) {
        try {
            const limit = parseInt(limitQuery) || 20;
        
            if (!username) {
              throw new BadRequestException(
                "Username is required"
              )
            }
        
            const resultUserInfo = await this.pool.query(
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
        
            if (resultUserInfo.rows.length === 0) {
              throw new NotFoundException(
                "User not found"
              )
            }
        
            const resultPosts = await this.pool.query(
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
        
            return{
                user: resultUserInfo.rows[0],
                posts: resultPosts.rows
              };
            
        } catch (err) {
            throw new InternalServerErrorException(
                "Get Account Info operation failed"
            )
        }
    }

    async changeAccountDesc(
        user_id: number,
        new_desc: string
    ) {

        try {
        
            const result = await this.pool.query(
                `
                UPDATE users
                SET description = $1
                WHERE id = $2
                RETURNING description
                `,
                [new_desc, user_id]
            );
        
            return result.rows[0]
        
        } catch (err) {
            throw new InternalServerErrorException(
                "Change Account Description operation failed"
            )
        }
    }

    async changeProfileImage(
        user_id: number,
        imagePath: string
    ) {

        try {
            const result = await this.pool.query(
                `
                UPDATE users
                SET image = $1
                WHERE id = $2
                RETURNING image
                `,
                [imagePath, user_id]
            );
    
            return result.rows[0];
    
        } catch (err) {
            throw new InternalServerErrorException(
                "Change Profile Image operation failed"
            )
        }
    }
}