import { ApiProperty } from "@nestjs/swagger";
import { IsFixed, Status } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { LedgerGroup } from "./ledger.groups.entity";
import { LedgerTypes } from "src/common/enums/ledger.group";

@Entity({ name: "ledger" })
export class Ledger extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column("char", { length: 12 })
  ledger_group_id: string;

  @ApiProperty()
  @Column("char", { length: 12 })
  user_id: string;

  @ApiProperty({ type: "enum", enum: LedgerTypes })
  @Column({ default: LedgerTypes.OTHER, type: "enum", enum: LedgerTypes })
  type: LedgerTypes;

  @ApiProperty({ type: "enum", enum: IsFixed })
  @Column({ default: IsFixed.NOT_FIXED })
  is_fixed: IsFixed;

  @ApiProperty({ type: "enum", enum: Status })
  @Column({ default: Status.ACTIVE, type: "enum", enum: Status })
  status: Status;

  @ManyToOne(() => LedgerGroup, (ledgerGroup) => ledgerGroup.id, {
    onDelete: "CASCADE",
    // lazy: true,
  })
  @JoinColumn({ name: "ledger_group_id" })
  ledgerGroup: LedgerGroup;

  // @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    // lazy: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
