import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsInt()
  leadId!: number;

  @IsString()
  @MinLength(1)
  content!: string;
}
