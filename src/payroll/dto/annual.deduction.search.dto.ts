import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
} from "class-validator";
import { IsRelational } from "src/common/decorators/dto";
import { QueryDto } from "src/common/trait/query.dto";

export class AnnualDeductionSearchDto extends QueryDto {
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
  amount: number;

}
