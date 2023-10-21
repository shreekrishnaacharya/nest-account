import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Status } from "src/common/enums/all.enum";

export class LedgerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ledger_group_id: string;

  @ApiProperty({
    enum: Status,
  })
  @IsString()
  @IsNotEmpty()
  status: Status;
}
