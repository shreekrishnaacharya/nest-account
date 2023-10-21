import { ApiProperty } from "@nestjs/swagger";
import { VoucherStatus, VoucherType } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { FiscalYear } from "src/fiscal-year/entities/fiscal.year.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { VoucherMeta } from "./voucher.meta.entity";

@Entity()
export class Voucher extends BaseEntity {
  @ApiProperty()
  @Column()
  transaction_date_np: string;

  @ApiProperty({ type: Date })
  @Column()
  transaction_date_en: Date;

  @ApiProperty()
  @Column()
  voucher_no: number;

  @ApiProperty()
  @Column("char", {
    length: 12,
    name: "approved_by",
    nullable: true,
    default: null,
  })
  approved_by: string;

  @ApiProperty()
  @Column("char", { length: 12, name: "posted_by" })
  posted_by: string;

  @ApiProperty()
  @Column("char", { length: 12, name: "fiscal_year_id" })
  fiscal_year_id: string;

  @ApiProperty()
  @Column()
  approved_date: Date;

  @ApiProperty()
  @Column()
  narration: string;

  @ApiProperty({ type: "enum", enum: VoucherStatus })
  @Column({
    type: "enum",
    enum: VoucherStatus,
    nullable: false,
    default: VoucherStatus.PENDING,
  })
  status: VoucherStatus;

  @ApiProperty({ type: "enum", enum: VoucherType })
  @Column({
    type: "enum",
    enum: VoucherType,
    nullable: false,
    default: VoucherType.JOURNAL,
  })
  type: VoucherType;

  @ApiProperty({ type: FiscalYear })
  @ManyToOne(() => FiscalYear, (fiscalYear) => fiscalYear.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "fiscal_year_id" })
  fiscalYear: () => FiscalYear;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "posted_by" })
  postedBy: () => User;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "approved_by" })
  approvedBy: () => User;

  @ApiProperty({ type: [VoucherMeta] })
  @OneToMany(() => VoucherMeta, (voucherMeta) => voucherMeta.voucher_id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  meta: VoucherMeta[];
}
