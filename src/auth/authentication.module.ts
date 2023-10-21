import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { IAuthModuleOptions, PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "../users/users.module";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { jwtConstants } from "./constants";
import { RefreshToken } from "./entities/refresh-token.entity";
import { RefreshTokensService } from "./services/refresh-tokens.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

const passportModuleOptions: IAuthModuleOptions = { defaultStrategy: "jwt" };
const jwtModuleOptions: JwtModuleOptions = {
  secret: jwtConstants.secret,
  signOptions: { expiresIn: "1h" },
};

@Module({
  imports: [
    UsersModule,
    PassportModule.register(passportModuleOptions),
    JwtModule.register(jwtModuleOptions),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokensService,
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
