import { Module, forwardRef } from "@nestjs/common";
import { SeederService } from "./service";
import { LedgersModule } from "src/ledgers/ledgers.module";
import { EmployeeModule } from "src/employees/employee.module";

@Module({
  imports: [
    forwardRef(() => LedgersModule),
    forwardRef(() => EmployeeModule),
  ],
  exports: [SeederService],
  providers: [SeederService],
})
export class SeederModule { }
