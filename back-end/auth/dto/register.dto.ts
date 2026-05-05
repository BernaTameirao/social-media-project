import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto{
    @IsString()
    @MaxLength(20)
    @MinLength(4)
    username!: string;

    @IsString()
    @MaxLength(20)
    @MinLength(4)
    password!: string;
}