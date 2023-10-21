import { IsNotEmpty } from "class-validator";

export class PasswordRequestResetDto {
  @IsNotEmpty()
  public email: string;
}
