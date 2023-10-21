import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
// import { Plan } from '../../plans/entities/plan.entity';

export class CreateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  public lastName: string;
}
