import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "src/common/models/response-message.model";
import { UsersService } from "src/users/users.service";
import { AuthenticationService } from "./authentication.service";
import { LoginUserDto } from "./dtos/login-user.dto";
import { PasswordRequestResetDto } from "./dtos/password-request-reset.dto";
import { PasswordResetDto } from "./dtos/password-reset.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { LocalAuthenticationGuard } from "./guards/local-authentication.guard";
import { AuthenticatedUser } from "./models/authenticated-user.model";

@ApiTags("auth")
@Controller("auth")
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly userService: UsersService
  ) { }

  @UseGuards(LocalAuthenticationGuard)
  @Post("login")
  @HttpCode(200)
  public async login(
    @Request() req,
    @Body() loginUseDot: LoginUserDto
  ): Promise<AuthenticatedUser> {
    const loggg = await this.authService.login(req.user)
    return loggg;
  }

  @Post("password-request")
  public async passwordResetRequest(
    @Body() passwordRequestDto: PasswordRequestResetDto
  ): Promise<ResponseMessage> {
    return this.userService.passwordRequestReset(passwordRequestDto.email);
  }

  @Post("password-reset")
  public async passwordReset(
    @Body() passwordResetDto: PasswordResetDto
  ): Promise<ResponseMessage> {
    if (passwordResetDto.password !== passwordResetDto.passwordConfirm)
      throw new UnprocessableEntityException(
        `Password and confirmation password must match`
      );
    return this.userService.passwordResetFromResetToken(
      passwordResetDto.password,
      passwordResetDto.code
    );
  }

  @Post("token")
  @HttpCode(200)
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<AuthenticatedUser> {
    return this.authService.refreshToken(
      refreshTokenDto.accessToken,
      refreshTokenDto.refreshToken
    );
  }
}
