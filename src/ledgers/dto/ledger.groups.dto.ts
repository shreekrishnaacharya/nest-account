import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BsHeads } from "src/common/enums/all.enum";

export class LedgerGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: "enum", enum: BsHeads })
  @IsNumber()
  @IsNotEmpty()
  bsHead: BsHeads;
}
