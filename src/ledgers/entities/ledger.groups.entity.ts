import { ApiProperty } from "@nestjs/swagger";
import { BsHeads, BsType, DrCr, IsFixed } from "src/common/enums/all.enum";
import { LedgerGroupTypes } from "src/common/enums/ledger.group";
import { BsHeadList } from "src/common/list/bshead.list";
import { BaseEntity } from "src/database/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity({ name: "ledger_group" })
export class LedgerGroup extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: "enum", enum: IsFixed, default: IsFixed.NOT_FIXED })
  @Column({ type: "enum", enum: IsFixed, default: IsFixed.NOT_FIXED })
  is_fixed: IsFixed;

  @ApiProperty()
  @Column("char", { length: 12 })
  user_id: string;

  @ApiProperty({ type: "enum", enum: BsHeads })
  @Column({ type: "enum", enum: BsHeads })
  bs_head: BsHeads;

  @ApiProperty({ type: "enum", enum: BsType })
  @Column({ type: "enum", enum: BsType })
  bs_type: BsType;

  @Column({ type: "enum", enum: LedgerGroupTypes, default: LedgerGroupTypes.OTHER })
  group_type: LedgerGroupTypes;

  @ApiProperty({ type: "enum", enum: DrCr })
  @Column({ type: "enum", enum: DrCr })
  account_side: DrCr;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @BeforeUpdate()
  @BeforeInsert()
  public beforeInsertAndUpdate() {
    // console.log(BsHeadList);
    // console.log("thisis bs_head", this.bs_head)
    const { account_side, bs_type } = BsHeadList[this.bs_head];
    console.log(account_side, bs_type)
    this.account_side = account_side;
    this.bs_type = bs_type;
  }
}
