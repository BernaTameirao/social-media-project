import {
    Injectable,
    Inject
} from '@nestjs/common';

import { Pool } from 'pg';

@Injectable()
export class AuthRepository{
    constructor(
        @Inject('PG_POOL') private readonly pool: Pool
    ) {}

    async register (
        username: string,
        password: string
    ) {

        const result = await this.pool.query(
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
            [username, password]
        );

        return result.rows;
    }

    async login (
        username: string
    ) {

        const result = await this.pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        return result.rows;
    }
}