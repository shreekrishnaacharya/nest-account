import { ApiProperty } from "@nestjs/swagger";
import { Page } from "src/common/models/page.model";
import { PayrollSetting } from "../entities/payroll.setting.entity";

export class PayrollSettingPage extends Page<PayrollSetting> {
  @ApiProperty({ type: [PayrollSetting] })
  public elements: PayrollSetting[];
}

