import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class NotificationsRepository {

    constructor(
        @Inject('PG_POOL') private readonly pool: Pool,
    ) {}

    async getNotifications(
        user_id: number,
        limit: number
    ) {
        const result = await this.pool.query(
             `
            SELECT
                users.username,
                notifications.type,
                notifications.created_at
            FROM notifications
            JOIN users
            ON users.id = notifications.actor_id
            WHERE notifications.recipient_id = $1
            ORDER BY notifications.created_at DESC
            LIMIT $2
            `,
            [user_id, limit]
        );

        return result.rows;
    }

    async createFollowNotification(
        recipientId: number,
        actorId: number,
        type: string,
    ) {

        const result = await this.pool.query(
            `
            INSERT INTO notifications
                (recipient_id, actor_id, type)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [recipientId, actorId, type]
        );

        return result.rows;
    }
}