import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VoucherDeleteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  voucher_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;
}
