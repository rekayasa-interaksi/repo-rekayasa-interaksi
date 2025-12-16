import { IsNotEmpty, IsString } from "class-validator";

export class DomisiliDto {
    @IsString()
    @IsNotEmpty()
    domisili: string;
}