import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/database/entities/base.entity";
import { Ledger } from "src/ledgers/entities/ledger.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class PayrollSetting extends BaseEntity {

  @ApiProperty()
  @Column("char", { length: 12 })
  ledger_id: string;

  @ApiProperty()
  @Column({ type: 'double' })
  max_amount: number;

  @ApiProperty()
  @ManyToOne(() => Ledger, (ledger: Ledger) => ledger.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "ledger_id" })
  ledger: () => Ledger;

}
