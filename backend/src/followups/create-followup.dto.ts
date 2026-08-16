import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateFollowupDto {
  @IsInt()
  leadId!: number;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  remark?: string;
}
