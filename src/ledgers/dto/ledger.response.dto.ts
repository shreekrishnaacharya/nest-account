import { ApiProperty } from "@nestjs/swagger";
import { Page } from "src/common/models/page.model";
import { Ledger } from "../entities/ledger.entity";
import { LedgerGroup } from "../entities/ledger.groups.entity";

export class LedgerPage extends Page<Ledger> {
  @ApiProperty({ type: [Ledger] })
  public elements: Ledger[];
}


export class LedgerGroupPage extends Page<LedgerGroup> {
  @ApiProperty({ type: [LedgerGroup] })
  public elements: LedgerGroup[];
}
