import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "../authentication.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.authenticationService.validateUser(
      username,
      password
    );
    if (!user) {
      throw new UnauthorizedException("Invalid username/password");
    }
    return user;
  }
}
