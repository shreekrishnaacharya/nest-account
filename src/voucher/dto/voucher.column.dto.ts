import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { VoucherStatus, VoucherType } from "src/common/enums/all.enum";

export class VoucherColumnDto {
  @ApiProperty({ required: false, type: "boolean" })
  @IsBoolean()
  @IsOptional()
  id: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  voucher_no: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  posted_by: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  approved_by: number;

  @ApiProperty({ type: "boolean", required: false })
  @IsBoolean()
  @IsOptional()
  status: VoucherStatus;

  @ApiProperty({ type: "boolean", required: false })
  @IsBoolean()
  @IsOptional()
  type: VoucherType;

  @ApiProperty({ type: "boolean", required: false })
  @IsBoolean()
  @IsOptional()
  transaction_date_en: boolean;

  @ApiProperty({ type: "boolean", required: false })
  @IsBoolean()
  @IsOptional()
  transaction_date_np: boolean;

  @ApiProperty({ type: "boolean", required: false })
  @IsBoolean()
  @IsOptional()
  narration: boolean;

  @ApiProperty({ type: "boolean", required: false })
  @IsBoolean()
  @IsOptional()
  meta: boolean;

  @ApiProperty({ type: "boolean", required: false })
  @IsBoolean()
  @IsOptional()
  approvedBy: boolean;
}
