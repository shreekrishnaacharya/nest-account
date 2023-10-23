import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database.module";
import { FiscalYearModule } from "./fiscal-year/fiscalyear.module";
import { InvoiceModule } from "./invoice/invoice.module";
import { LedgersModule } from "./ledgers/ledgers.module";
import { VoucherModule } from "./voucher/voucher.module";
import { SeederService } from "./common/seeder/service";
import { SeederModule } from "./common/seeder/seeder.module";

@Module({
  imports: [
    DatabaseModule,
    LedgersModule,
    FiscalYearModule,
    VoucherModule,
    InvoiceModule,
    SeederModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
