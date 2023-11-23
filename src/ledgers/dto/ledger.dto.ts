import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { LedgerTypes } from "src/common/enums/ledger.group";

export class LedgerDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Name cannot be empty" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Code cannot be empty" })
  code: string;

  @ApiProperty({ type: "enum", enum: LedgerTypes, default: LedgerTypes.OTHER })
  @IsOptional()
  type: LedgerTypes;

  @ApiProperty()
  @IsNotEmpty({ message: "Ledger group cannot be empty" })
  ledger_group_id: string;

}
