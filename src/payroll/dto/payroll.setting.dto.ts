import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
} from "class-validator";
import { PayrollType } from "src/common/enums/all.enum";

export class PayrollSettingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ledger_id: string;

  @ApiProperty()
  max_amount: number;

}
