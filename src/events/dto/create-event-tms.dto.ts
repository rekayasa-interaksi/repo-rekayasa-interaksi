import { IsNotEmpty, IsString } from "class-validator";

export class CreateEventTmsDto {
    @IsNotEmpty()
    poster: Express.Multer.File

    @IsNotEmpty()
    @IsString()
    program_categories_id: string

    @IsNotEmpty()
    @IsString()
    program_types_id: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    start_datetime: string

    @IsNotEmpty()
    end_datetime: string

    @IsNotEmpty()
    target_participants: number

    @IsNotEmpty()
    @IsString()
    location: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    ticket_price: number

    @IsNotEmpty()
    budget: number

    @IsNotEmpty()
    @IsString()
    source_budget: string

    @IsNotEmpty()
    min_age: number

    @IsNotEmpty()
    max_age: number

    @IsNotEmpty()
    @IsString()
    participant_background: string

    @IsString()
    theme: string
}