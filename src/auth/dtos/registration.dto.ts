import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateAccountDto } from "./create-account.dto";
import { CreateUserDto } from "./create-user.dto";
// import { CreateAddressDto } from './create-address.dto';

export class RegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  public account: CreateAccountDto;

  @ApiProperty()
  @IsNotEmpty()
  public user: CreateUserDto;
}
