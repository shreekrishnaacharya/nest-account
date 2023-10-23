import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Status } from "src/common/enums/all.enum";

export class LedgerDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  ledger_group_id: string;

  @ApiProperty({
    enum: Status,
  })
  @IsNotEmpty()
  status: Status;
}
