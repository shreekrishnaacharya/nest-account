import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class VoucherMetaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ledgerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  narration: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  reference_no: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  reference_date: string;
}
