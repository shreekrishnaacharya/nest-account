import { ApiProperty } from "@nestjs/swagger";
import {
  ValidateNested,
} from "class-validator";
import { AnnualDeductionDto } from "./annual.deduction.dto";

export class AnnualDeductionCreateDto {
  @ApiProperty({ type: [AnnualDeductionDto] })
  @ValidateNested({ each: true })
  annualDeduction: AnnualDeductionDto[];
}
