import { ApiProperty } from "@nestjs/swagger";
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

  @ApiProperty()
  amount: number;

}
