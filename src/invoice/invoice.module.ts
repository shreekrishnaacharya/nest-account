import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthModule } from '../auth/auth.module';
import { AuthenticationModule } from "src/auth/authentication.module";
import { VoucherModule } from "src/voucher/voucher.module";
import { Invoice } from "./entities/invoice.entity";
import { InvoiceItem } from "./entities/invoice.item.entity";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./service/invoice.service";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => VoucherModule),
    passportModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
