import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class VoucherMetaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Ledger should not be empty' })
  ledgerId: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Amount should be number' })
  @IsNotEmpty({ message: 'Amount should not be empty' })
  @Type(() => Number)
  amount: number;

  @ApiProperty()
  @IsOptional()
  narration: string;

  @ApiProperty()
  @IsOptional()
  reference_no: string;

  @ApiProperty()
  @IsOptional()
  reference_date: string;
}
