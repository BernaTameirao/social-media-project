import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';

import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
    constructor(
        private readonly postsRepository: PostsRepository
    ) {}

    async getPosts(
        limitQuery: string
    ) {
        try {
            const limit = parseInt(limitQuery) || 20;

            const result = await this.postsRepository.getPosts(
                limit
            );

            return result;
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

            const result = await this.postsRepository.getUserFeed(
                user_id,
                limit
            );

            return result;
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

            const insertion = await this.postsRepository.createPost_Insert(
                user_id,
                content
            );

            const postId = insertion[0].id;

            const result = await this.postsRepository.createPost_Select(
                postId
            );

            return result[0];
        } catch (err) {
            throw new InternalServerErrorException(
                "Create Post operation failed"
            );
        }
    }
}