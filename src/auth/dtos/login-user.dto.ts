import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class LoginUserDto {
  @ApiProperty({ example: "sksharma72000@gmail.com" })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: "krishna" })
  @IsNotEmpty()
  readonly password: string;
}
