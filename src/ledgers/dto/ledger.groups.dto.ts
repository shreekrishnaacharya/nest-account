import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BsHeads } from "src/common/enums/all.enum";

export class LedgerGroupDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name cannot be empty" })
  name: string;

  @ApiProperty({ type: "enum", enum: BsHeads })
  @IsNotEmpty({ message: "Bs head cannot be empty" })
  bs_head: BsHeads;
}
