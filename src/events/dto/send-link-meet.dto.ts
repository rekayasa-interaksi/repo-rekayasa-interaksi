import { IsArray, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendLinkMeetingDto {
  @IsString()
  @IsNotEmpty()
  zoom_link: string;

  @IsString()
  @IsNotEmpty()
  event_id: string;
}