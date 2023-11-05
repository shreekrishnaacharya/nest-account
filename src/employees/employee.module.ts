import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthModule } from '../auth/auth.module';
import { AuthenticationModule } from "src/auth/authentication.module";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./service/employee.service";
import { Employee } from "./entities/employee.entity";
import { LedgersModule } from "src/ledgers/ledgers.module";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => LedgersModule),
    passportModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule { }
