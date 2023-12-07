import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthModule } from '../auth/auth.module';
import { AuthenticationModule } from "src/auth/authentication.module";
import { VoucherModule } from "src/voucher/voucher.module";
import { Payroll } from "./entities/payroll.entity";
import { PayrollController } from "./payroll.controller";
import { PayrollService } from "./service/payroll.service";
import { PayrollSettingController } from "./payroll.setting.controller";
import { PayrollSetting } from "./entities/payroll.setting.entity";
import { PayrollSettingService } from "./service/payroll.setting.service";
import { AnnualDeductionController } from "./annual.deduction.controller";
import { AnnualDeduction } from "./entities/annual.deduction.entity";
import { AnnualDeductionService } from "./service/annual.deduction.service";
import { LedgersModule } from "src/ledgers/ledgers.module";
import { EmployeeModule } from "src/employees/employee.module";
import { PostPayrollController } from "./post.payroll.controller";
import { PayrollPost } from "./entities/payroll.post.entity";
import { PayrollPostService } from "./service/payroll.post.service";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, PayrollSetting, AnnualDeduction, PayrollPost]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => VoucherModule),
    forwardRef(() => LedgersModule),
    forwardRef(() => EmployeeModule),
    passportModule,
  ],
  controllers: [PayrollController, PayrollSettingController, AnnualDeductionController, PostPayrollController],
  providers: [PayrollService, PayrollSettingService, AnnualDeductionService, PayrollPostService],
  exports: [PayrollService],
})
export class PayrollModule { }
