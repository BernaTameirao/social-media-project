import {
    Controller,
    Get,
    Patch,
    Req,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AccountService } from './account.service';
import { ChangeDescDto } from './dto/change-desc.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { multerConfig } from '../common/multer.config';

@Controller("account")
export class AccountController {
    constructor(
        private readonly accountService: AccountService
    ) {}

    @Get("get-info")
    getAccountInfo(
        @Req() req
    ) {
        return this.accountService.getAccountInfo(
            req.query.username,
            req.query.limit
        )
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    getUserAccountName(
        @Req() req
    ) {
        return {
            id: req.user.id,
            username: req.user.username
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch("update/profile-desc")
    changeAccountDesc(
        @Req() req,
        @Body() body: ChangeDescDto
    ) {
        return this.accountService.changeAccountDesc(
            req.user.id,
            body.new_desc
        )
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('profileImage', multerConfig))
    @Patch("update/profile-image")
    changeProfileImage(
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const imagePath = `uploads/${file.filename}`;
        return this.accountService.changeProfileImage(
            req.user.id,
            imagePath
        )
    }
}