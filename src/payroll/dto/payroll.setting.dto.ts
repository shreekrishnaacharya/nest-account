import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { PayrollType } from "src/common/enums/all.enum";

export class PayrollSettingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ledger_id: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  max_amount: number;

}
