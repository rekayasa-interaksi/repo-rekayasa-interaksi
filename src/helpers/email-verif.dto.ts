import { IsString } from "class-validator";

export class HeaderData {
    @IsString()
    name;

    @IsString()
    to_email;

    @IsString()
    subject;

    @IsString()
    from_email;
}