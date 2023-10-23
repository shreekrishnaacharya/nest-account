import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class VoucherMetaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Ledger should not be empty' })
  @Type(() => String)
  ledgerId: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Amount should be number' })
  @IsNotEmpty({ message: 'Amount should not be empty' })
  @Type(() => Number)
  amount: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  narration: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  reference_no: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  reference_date: string;
}
