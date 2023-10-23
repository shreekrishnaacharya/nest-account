import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthModule } from '../auth/auth.module';
import { AuthenticationModule } from "src/auth/authentication.module";
import { Ledger } from "./entities/ledger.entity";
import { LedgerGroup } from "./entities/ledger.groups.entity";
import { LedgersController } from "./ledgers.controller";
import { LedgerGroupService } from "./service/ledger.group.service";
import { LedgerService } from "./service/ledgers.service";
import { LedgerGroupController } from "./group.controller";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

@Module({
  imports: [
    forwardRef(() => AuthenticationModule),
    TypeOrmModule.forFeature([Ledger, LedgerGroup]),
    passportModule,
  ],
  controllers: [LedgersController, LedgerGroupController],
  providers: [LedgerService, LedgerGroupService],
  exports: [LedgerService, LedgerGroupService],
})
export class LedgersModule { }
