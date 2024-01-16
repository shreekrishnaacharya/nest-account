import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional,Min } from "class-validator";

export class PayrollEntryMetaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Ledger cannot be empty' })
  ledger_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Amount cannot be empty' })
  @IsNumber({}, { message: 'Amount should be number' })
  @Min(1)
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
