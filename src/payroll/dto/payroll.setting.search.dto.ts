import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { IsRelational } from "src/common/decorators/dto";
import { PayrollType } from "src/common/enums/all.enum";
import { QueryDto } from "src/common/trait/query.dto";

export class PayrollSettingSearchDto  extends QueryDto{
  @ApiProperty({ required: false })
  @Type(() => Boolean)
  @IsRelational()
  @IsOptional()
  ledger: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  ledger_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  max_amount: number;

}
