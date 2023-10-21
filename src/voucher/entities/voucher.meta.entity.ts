import { ApiProperty } from "@nestjs/swagger";
import { DrCr } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { Ledger } from "src/ledgers/entities/ledger.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Voucher } from "./voucher.entity";

@Entity()
export class VoucherMeta extends BaseEntity {
  @ApiProperty()
  @Column()
  serial_no: number;

  @ApiProperty({ type: DrCr })
  @Column()
  dr_cr: DrCr;

  @ApiProperty()
  @Column("char", { length: 12, name: "voucher_id" })
  voucher_id: string;

  @ApiProperty()
  @Column("char", { length: 12, name: "ledger_id" })
  ledger_id: string;

  @ApiProperty()
  @Column()
  amount: number;

  @ApiProperty()
  @Column()
  narration: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  documents: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  reference_no: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  reference_date: string;

  @ApiProperty({ type: Voucher })
  @ManyToOne(() => Voucher, (voucher) => voucher.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "voucher_id" })
  voucher: () => Voucher;

  @ApiProperty({ type: Ledger })
  @ManyToOne(() => Ledger, (ledger) => ledger.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "ledger_id" })
  ledger: () => Ledger;
}
