import { IsString, MaxLength } from 'class-validator';

export class ChangeDescDto {
    @IsString()
    @MaxLength(200)
    new_desc!: string;
}