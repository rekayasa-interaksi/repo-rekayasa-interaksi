import { IsEnum, IsNotEmpty } from "class-validator";

export class DeleteImageDto {
    @IsEnum(['profile', 'cover', 'all'], {
        message: 'type hanya boleh bernilai profile, cover, atau all',
    })
    @IsNotEmpty()
    type: 'profile' | 'cover' | 'all';
}