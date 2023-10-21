import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthModule } from '../auth/auth.module';
import { AuthenticationModule } from "src/auth/authentication.module";
import { FiscalYearModule } from "src/fiscal-year/fiscalyear.module";
import { LedgersModule } from "src/ledgers/ledgers.module";
import { VoucherCancel } from "./entities/voucher.cancel.entity";
import { Voucher } from "./entities/voucher.entity";
import { VoucherMeta } from "./entities/voucher.meta.entity";
import { VoucherService } from "./service/voucher.service";
import { VoucherController } from "./voucher.controller";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

@Module({
  imports: [
    TypeOrmModule.forFeature([Voucher, VoucherMeta, VoucherCancel]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => FiscalYearModule),
    forwardRef(() => LedgersModule),
    passportModule,
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
