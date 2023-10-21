import { ApiProperty } from "@nestjs/swagger";
import { Page } from "src/common/models/page.model";
import { Ledger } from "../entities/ledger.entity";

export class LedgerPage extends Page<Ledger> {
  @ApiProperty({ type: [Ledger] })
  public elements: Ledger[];
}
