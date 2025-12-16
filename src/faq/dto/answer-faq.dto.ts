import { IsNotEmpty, IsString } from 'class-validator';

export class AnswerFaqDto {
  @IsNotEmpty()
  @IsString()
  answer: string;
}
