import { ApiProperty } from "@nestjs/swagger";
import { BsHeads, BsType, DrCr, IsFixed } from "src/common/enums/all.enum";
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

  @ApiProperty({ type: "enum", enum: IsFixed })
  @Column({ type: "enum", enum: IsFixed, default: IsFixed.NOT_FIXED })
  is_fixed: IsFixed;

  @ApiProperty()
  @Column("char", { length: 12 })
  user_id: string;

  @ApiProperty({ type: "enum", enum: BsHeads })
  @Column({ type: "enum", enum: BsHeads })
  bsHead: BsHeads;

  @ApiProperty({ type: "enum", enum: BsType })
  @Column({ type: "enum", enum: BsType })
  bs_type: BsType;

  @ApiProperty({ type: "enum", enum: DrCr })
  @Column({ type: "enum", enum: DrCr })
  account_side: DrCr;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "user_id" })
  user: () => User;

  @BeforeUpdate()
  @BeforeInsert()
  public beforeInsertAndUpdate() {
    const { account_side, bs_type } = BsHeadList[this.bsHead];
    this.account_side = account_side;
    this.bs_type = bs_type;
  }
}
