import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { AccountRepository } from './account.repository';


@Injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository
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

            const resultUserInfo = await this.accountRepository.getAccountInfo_UserInfo(
                username
            )

            if (resultUserInfo.length === 0) {

                throw new NotFoundException(
                    "User not found"
                )
            }

            const resultPosts = await this.accountRepository.getAccountInfo_Posts(
                username,
                limit
            )

            return{
                user: resultUserInfo[0],
                posts: resultPosts
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
        
            const result = await this.accountRepository.changeAccountDesc(
                user_id,
                new_desc
            );
            return result[0];
        
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
            const result = await this.accountRepository.changeProfileImage(
                user_id,
                imagePath
            );
    
            return result[0];
    
        } catch (err) {
            throw new InternalServerErrorException(
                "Change Profile Image operation failed"
            )
        }
    }
}