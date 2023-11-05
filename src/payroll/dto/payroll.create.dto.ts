import { ApiProperty } from "@nestjs/swagger";
import {
  ValidateNested,
} from "class-validator";
import { PayrollDto } from "./payroll.dto";
import { Type } from "class-transformer";

export class PayrollCreateDto {
  @ApiProperty({ type: [PayrollDto] })
  @ValidateNested({ each: true })
  @Type(() => PayrollDto)
  payroll: PayrollDto[];

}
