import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  public phone: string;

  @ApiProperty()
  @IsNotEmpty()
  public password: string;
}
