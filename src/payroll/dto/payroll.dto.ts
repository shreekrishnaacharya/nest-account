import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
} from "class-validator";
import { PayrollType } from "src/common/enums/all.enum";

export class PayrollDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ledger_id: string;

  @ApiProperty({ type: "enum", enum: PayrollType })
  @IsString()
  @IsNotEmpty()
  type: PayrollType;

  @ApiProperty()
  @Type(() => Number)
  amount: number;

}
