import { ApiProperty } from "@nestjs/swagger";
import { PStatus } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Voucher } from "./voucher.entity";

@Entity()
export class VoucherCancel extends BaseEntity {
  @ApiProperty()
  @Column("char", { name: "voucher_id", length: 12 })
  voucher_id: string;

  @ApiProperty()
  @Column("char", { length: 12 })
  discarded_by: string;

  @ApiProperty()
  @Column()
  reason: string;

  @ApiProperty({ type: "enum", enum: PStatus })
  @Column({ type: "enum", enum: PStatus, default: PStatus.PENDING })
  status: PStatus;

  @OneToOne(() => Voucher, (voucher) => voucher.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "voucher_id" })
  voucher: () => Voucher;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "discarded_by" })
  discardedBy: () => User;
}
