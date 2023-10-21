import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthModule } from '../auth/auth.module';
import { AuthenticationModule } from "src/auth/authentication.module";
import { FiscalYear } from "./entities/fiscal.year.entity";
import { FiscalYearController } from "./fiscalyear.controller";
import { FiscalYearService } from "./fiscalyear.service";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

@Module({
  imports: [
    TypeOrmModule.forFeature([FiscalYear]),
    forwardRef(() => AuthenticationModule),
    passportModule,
  ],
  controllers: [FiscalYearController],
  providers: [FiscalYearService],
  exports: [FiscalYearService],
})
export class FiscalYearModule {}
