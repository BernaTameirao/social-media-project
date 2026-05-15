import {
    Injectable,
    BadRequestException,
    InternalServerErrorException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService{
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) {}

    async register(
        username: string,
        password: string
    ) {
        try{
        
            // Encrypts the password.
            const hashed = await bcrypt.hash(password, 10);
        
            // Sends the user data to the database.
            const result = await this.authRepository.register(
                username,
                hashed
            );
        
            return result[0];
        } catch (err) {

            if (err.code === '23505') { 
                throw new BadRequestException(
                    "Username already exists"
                );
            }

            throw new InternalServerErrorException(
                "Register operation failed"
            )
        }
    }

    async login(
        username: string,
        password: string
    ) { 
        try {         
            // Gets the data related to the given username.
            const result = await this.authRepository.login(
                username
            );
        
            const user = result[0];
        
            // If the username isn't present on the database, return error.
            if (!user) {
                throw new BadRequestException(
                    "User not found"
                )
            }
        
            // Compares the given password to the password present on the database.
            const match = await bcrypt.compare(password, user.password_hash);
        
            // If it doesn't match, return error.
            if (!match) {
                throw new BadRequestException(
                    "Invalid password"
                )
            }
        
            // Creates a token.
            const token = this.jwtService.sign({
                id: user.id, 
                username: user.username
            });
        
            return{ token };
        } catch (err) {
            throw new InternalServerErrorException(
                "Login operation failed"
            )
        }
    }
}