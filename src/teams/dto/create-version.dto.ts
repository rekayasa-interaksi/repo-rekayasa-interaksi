import { IsNotEmpty, IsString } from "class-validator";

export class CreateVersionDto {
    @IsString()
    @IsNotEmpty()
    version: string;

    @IsString()
    @IsNotEmpty()
    generation: string;
}