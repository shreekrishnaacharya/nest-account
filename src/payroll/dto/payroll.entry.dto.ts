import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { PayrollEntryMetaDto } from "./payroll.entry.meta.dto";
import { Transform, Type } from "class-transformer";
import { IsDateInFormat, IsValidEntry } from "src/common/rules";
import { MonthList } from "src/common/enums/all.enum";

export class PayrollEntryDto {
  @ApiProperty({ type: [PayrollEntryMetaDto] })
  // @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PayrollEntryMetaDto)
  drEntry: PayrollEntryMetaDto[];

  @ApiProperty({ type: [PayrollEntryMetaDto] })
  // @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PayrollEntryMetaDto)
  crEntry: PayrollEntryMetaDto[];

  @ApiProperty()
  @IsDateString(undefined, { message: 'Invalid date format. Please use the format YYYY-MM-DD' })
  @IsNotEmpty({ message: 'English date cannot be empty' })
  transaction_date_en: string;

  @ApiProperty()
  // @IsDateInFormat("YYYY-MM-DD")
  @IsNotEmpty({ message: 'Nepali date cannot be empty' })
  transaction_date_np: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Narration cannot be empty' })
  narration: string;

}
