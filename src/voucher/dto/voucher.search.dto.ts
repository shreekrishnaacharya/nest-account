import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { VoucherStatus, VoucherType } from "src/common/enums/all.enum";
import { QueryDto } from "src/common/trait/query.dto";

export class VoucherSearchDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  voucher_no: string;

  @ApiProperty({ required: false })
  @IsOptional()
  posted_by: string;

  @ApiProperty({ required: false })
  @IsOptional()
  approved_by: string;

  @ApiProperty({ type: "enum", enum: VoucherStatus, required: false })
  @IsOptional()
  status: VoucherStatus;

  @ApiProperty({ type: "enum", enum: VoucherType, required: false })
  @IsOptional()
  type: VoucherType;

  @ApiProperty({ required: false })
  @IsOptional()
  narration: string;
}
