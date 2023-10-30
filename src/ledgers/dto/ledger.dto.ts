import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LedgerDto {
  @ApiProperty()
  @IsNotEmpty({message:"Name cannot be empty"})
  name: string;

  @ApiProperty()
  @IsNotEmpty({message:"Code cannot be empty"})
  code: string;

  @ApiProperty()
  @IsNotEmpty({message:"Ledger group cannot be empty"})
  ledger_group_id: string;

}
