import { ApiProperty } from "@nestjs/swagger";
import { Status, YesNo } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { FiscalYear } from "src/fiscal-year/entities/fiscal.year.entity";
import { Voucher } from "src/voucher/entities/voucher.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Invoice extends BaseEntity {
  @ApiProperty()
  @Column()
  party_name: string;

  @ApiProperty({ nullable: true, default: null, required: false })
  @Column({ nullable: true, default: null })
  address: string;

  @ApiProperty({ nullable: true, default: null, required: false })
  @Column({ nullable: true, default: null })
  contact: string;

  @ApiProperty({ nullable: true, default: null, required: false })
  @Column({ nullable: true, default: null })
  pan_no: string;

  @ApiProperty()
  @Column()
  amount: number;

  @ApiProperty({ default: 0 })
  @Column({ default: 0 })
  discount: number;

  @ApiProperty()
  @Column()
  total: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true, default: null })
  notes: string;

  @ApiProperty()
  @Column()
  transaction_date_np: string;

  @ApiProperty({ type: Date })
  @Column()
  transaction_date_en: Date;

  @ApiProperty()
  @Column("char", { length: 12 })
  user_id: string;

  @ApiProperty()
  @Column("char", { length: 12, name: "fiscal_year_id", nullable: false })
  fiscal_year_id: string;

  @ApiProperty()
  @Column("char", { length: 12, name: "voucher_id", nullable: false })
  voucher_id: string;

  @ApiProperty()
  @Column()
  bill_no: number;

  @Column({
    enum: YesNo,
    type: "enum",
    name: "is_active",
    nullable: false,
    default: YesNo.YES,
  })
  is_active: YesNo;

  @Column({ enum: YesNo, type: "enum", nullable: false, default: YesNo.NO })
  is_sync: YesNo;

  @Column({ enum: YesNo, type: "enum", nullable: false, default: YesNo.YES })
  is_printed: YesNo;

  @ApiProperty({
    enum: Status,
    type: "enum",
    nullable: false,
    default: Status.ACTIVE,
  })
  @Column({
    enum: Status,
    type: "enum",
    nullable: false,
    default: Status.ACTIVE,
  })
  status: Status;

  @ApiProperty()
  @OneToOne(() => Voucher, (voucher: Voucher) => voucher.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "voucher_id" })
  vouchers: () => Voucher;

  @ApiProperty()
  @ManyToOne(() => FiscalYear, (fiscal: FiscalYear) => fiscal.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "fiscal_year_id" })
  fiscalYear: () => FiscalYear;
}
