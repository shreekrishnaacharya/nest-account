import { ApiProperty } from "@nestjs/swagger";
import { Page } from "src/common/models/page.model";
import { AnnualDeduction } from "../entities/annual.deduction.entity";

export class AnnualDeductionPage extends Page<AnnualDeduction> {
  @ApiProperty({ type: [AnnualDeduction] })
  public elements: AnnualDeduction[];
}

