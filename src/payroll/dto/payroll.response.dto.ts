import { ApiProperty } from "@nestjs/swagger";
import { Page } from "src/common/models/page.model";
import { Payroll } from "../entities/payroll.entity";

export class PayrollPage extends Page<Payroll> {
  @ApiProperty({ type: [Payroll] })
  public elements: Payroll[];
}

