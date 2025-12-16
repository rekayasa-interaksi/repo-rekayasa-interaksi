import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateIf, ValidateNested } from "class-validator";
import { SocialMediaDto } from "./social-media.dto";
import { Type } from "class-transformer";

export class UpdateUserDto {
    @ValidateIf((_, value) => value !== '')
    @IsString()
    @IsOptional()
    name?: string;

    @ValidateIf((_, value) => value !== '')
    @IsString()
    @IsOptional()
    phone?: string;

    @ValidateIf((_, value) => value !== '')
    @IsString()
    @IsOptional()
    status?: string;

    @ValidateIf((_, value) => value !== '')
    @IsString()
    @IsOptional()
    regional_origin?: string;

    @ValidateIf((_, value) => value !== '')
    @IsDateString()
    @IsOptional()
    birthday?: string;

    @ValidateIf((_, value) => value !== '')
    @IsOptional()
    @IsEnum(['L', 'P'], {
        message: 'gender hanya boleh bernilai L atau P',
    })
    gender?: 'L' | 'P';

    @ValidateIf((_, value) => value !== '')
    @IsString()
    @MaxLength(4)
    @IsOptional()
    generation?: string;

    @IsUUID()
    @IsOptional()
    student_club_id?: string;

    @IsUUID()
    @IsOptional()
    student_chapter_id?: string;

    @IsUUID()
    @IsOptional()
    major_campus_id?: string;

    @IsUUID()
    @IsOptional()
    program_alumni_id?: string;

    @IsUUID()
    @IsOptional()
    student_campus_id?: string;

    @IsUUID()
    @IsOptional()
    domisili_id?: string;

    @ValidateNested()
    @Type(() => SocialMediaDto)
    @IsOptional()
    social_media?: SocialMediaDto;
}