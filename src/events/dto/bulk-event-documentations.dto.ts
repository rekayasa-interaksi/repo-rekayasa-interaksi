import { IsOptional, IsString } from 'class-validator';

export class BulkEventDocumentationsDto {
  @IsOptional()
  @IsString()
  detail_event_id?: string;
}
