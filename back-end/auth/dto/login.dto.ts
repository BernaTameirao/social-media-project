import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto{
    @IsString()
    @MaxLength(20)
    @MinLength(4)
    username!: string;

    @IsString()
    @MaxLength(20)
    @MinLength(4)
    password!: string;
}