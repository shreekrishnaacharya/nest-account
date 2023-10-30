import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { VoucherMetaDto } from "./voucher.meta.dto";
import { Transform, Type } from "class-transformer";
import { IsDateInFormat, IsValidEntry } from "src/common/rules";

export class VoucherEntryDto {
  @ApiProperty({ type: [VoucherMetaDto] })
  // @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => VoucherMetaDto)
  drEntry: VoucherMetaDto[];

  @ApiProperty({ type: [VoucherMetaDto] })
  // @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => VoucherMetaDto)
  crEntry: VoucherMetaDto[];

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

  @ApiProperty({ required: false, description: "This property does not takes inputs. Rather any validatiopn error related to current entry will be reture on this field" })
  @IsValidEntry(this)
  @IsOptional()
  validation: string
}
