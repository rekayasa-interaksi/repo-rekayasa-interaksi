import { IsNotEmpty, IsString } from "class-validator";

export class CreateFeatureDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    version_system_id: string;
}