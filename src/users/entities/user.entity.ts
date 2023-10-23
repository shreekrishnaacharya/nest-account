import { Column, Entity, Generated, OneToMany } from "typeorm";
import { RefreshToken } from "../../auth/entities/refresh-token.entity";
import { BaseEntity } from "../../database/entities/base.entity";

import { ApiProperty } from "@nestjs/swagger";
import { VoucherCancel } from "src/voucher/entities/voucher.cancel.entity";
import { Voucher } from "src/voucher/entities/voucher.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ nullable: false, unique: true })
  public email: string;

  @ApiProperty()
  @Column({ nullable: false, unique: true })
  public phone: string;

  @ApiProperty()
  @Column({ nullable: false })
  public username: string;

  @ApiProperty()
  @Column({ nullable: false, select: false })
  public password: string;

  @ApiProperty()
  @Column({ nullable: false })
  public type: string;

  @ApiProperty()
  @Column({ name: "reset_token", nullable: false })
  @Generated("uuid")
  public resetToken: string;

  @ApiProperty({ type: Date })
  @Column({
    name: "reset_token_expiration",
    nullable: false,
    type: "timestamp",
  })
  public resetTokenExpiration: Date;

  @ApiProperty({ type: [RefreshToken] })
  @OneToMany((type) => RefreshToken, (token) => token.user, { lazy: true })
  public refreshTokens: RefreshToken[];

  @ApiProperty({ type: [Voucher] })
  @OneToMany(() => Voucher, (voucher) => voucher.postedBy, { lazy: true })
  voucherPosted: Voucher[];

  @ApiProperty({ type: [Voucher] })
  @OneToMany(() => Voucher, (voucher) => voucher.approvedBy, { lazy: true })
  voucherApproved: Voucher[];

  @ApiProperty({ type: [VoucherCancel] })
  @OneToMany(
    () => VoucherCancel,
    (voucher: VoucherCancel) => voucher.discardedBy,
    { lazy: true }
  )
  voucherDiscarded: VoucherCancel[];
}
