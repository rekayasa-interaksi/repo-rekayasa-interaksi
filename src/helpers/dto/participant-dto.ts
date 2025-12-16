import { IsString } from "class-validator";

export class ParticipantDto {
    @IsString()
    type: string;

    @IsString()
    event_id?: string;

    @IsString()
    id?: string;

    @IsString()
    name: string;

    @IsString()
    major_id: string;

    @IsString()
    class_year: string;

    @IsString()
    gender: string;

    @IsString()
    date_of_birth: Date;

    @IsString()
    email: string;

    @IsString()
    phone_number: string;

    @IsString()
    instagram: string;

    @IsString()
    linkedin: string;
}