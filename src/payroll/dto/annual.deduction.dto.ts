import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class AnnualDeductionDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ledger_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

}
