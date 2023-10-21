import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class VoucherCancelDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  voucher_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  reason: string;
}
