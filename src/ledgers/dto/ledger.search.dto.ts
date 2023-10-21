import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Status } from "src/common/enums/all.enum";

export class LedgerSearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ledger_group: string;

  @ApiProperty({
    type: "enum",
    enum: Status,
    required: false,
  })
  @IsString()
  @IsOptional()
  status: Status;
}
