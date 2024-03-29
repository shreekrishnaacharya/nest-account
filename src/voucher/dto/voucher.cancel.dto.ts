import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class VoucherCancelDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Voucher cannot be empty" })
  voucher_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Reason cannot be empty" })
  reason: string;
}
