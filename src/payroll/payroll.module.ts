import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthModule } from '../auth/auth.module';
import { AuthenticationModule } from "src/auth/authentication.module";
import { VoucherModule } from "src/voucher/voucher.module";
import { Payroll } from "./entities/payroll.entity";
import { PayrollController } from "./payroll.controller";
import { PayrollService } from "./service/payroll.service";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => VoucherModule),
    passportModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule { }
