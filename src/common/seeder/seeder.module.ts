import { Module, forwardRef } from "@nestjs/common";
import { SeederService } from "./service";
import { LedgersModule } from "src/ledgers/ledgers.module";

@Module({
  imports: [
    forwardRef(() => LedgersModule),
  ],
  exports: [SeederService],
  providers: [SeederService],
})
export class SeederModule { }
