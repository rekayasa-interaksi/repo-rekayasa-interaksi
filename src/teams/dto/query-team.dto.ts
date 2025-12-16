import { IsOptional, IsString } from "class-validator";

export class QueryTeamDto {
    @IsString()
    @IsOptional()
    generation: string;

    @IsString()
    @IsOptional()
    version_system_id: string;
}