import {
    Controller,
    Get,
    Post,
    Req,
    Body,
    UseGuards
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("posts")
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Get()
    getPosts(
        @Req() req
    ) {
        return this.postsService.getPosts(
            req.query.limit
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get("get-user-feed")
    getUserFeed(
        @Req() req
    ) {
        return this.postsService.getUserFeed(
            req.user.id,
            req.query.limit
        )
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createPost(
        @Req() req,
        @Body() body: CreatePostDto
    ) {
        return this.postsService.createPost(
            req.user.id,
            body.content
        )
    }
}