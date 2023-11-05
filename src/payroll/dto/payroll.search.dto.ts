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

export class PayrollSearchDto  extends QueryDto{
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
  employee_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  ledger_name: string;

  @ApiProperty({ required: false, type: "enum", enum: PayrollType })
  @IsOptional()
  type: PayrollType;

  @ApiProperty({ required: false })
  @IsOptional()
  amount: number;

}
