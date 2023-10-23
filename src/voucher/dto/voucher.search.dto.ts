import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { VoucherStatus, VoucherType } from "src/common/enums/all.enum";
import { QueryDto } from "src/common/trait/query.dto";

export class VoucherSearchDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  voucher_no: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  posted_by: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  approved_by: number;

  @ApiProperty({ type: "enum", enum: VoucherStatus, required: false })
  @IsString()
  @IsOptional()
  status: VoucherStatus;

  @ApiProperty({ type: "enum", enum: VoucherType, required: false })
  @IsString()
  @IsOptional()
  type: VoucherType;

  // @ApiProperty({ required: false })
  // @IsDate()
  // @IsDateInFormat("YYYY-MM-DD")
  // @IsOptional()
  // transaction_date_en: string;

  // @ApiProperty({ required: false })
  // @IsDateInFormat("YYYY-MM-DD")
  // @IsOptional()
  // transaction_date_np: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  narration: string;
}
