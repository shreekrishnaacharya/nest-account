import { ApiProperty } from "@nestjs/swagger";
import { MonthList, PayrollType } from "src/common/enums/all.enum";
import { Generator } from "src/common/helpers/id.generator";
import { BaseEntity } from "src/database/entities/base.entity";
import { BeforeInsert, Column, Entity } from "typeorm";

@Entity()
export class PayrollPost extends BaseEntity {

  @ApiProperty()
  @Column()
  particular: string;

  @ApiProperty()
  @Column("char", { length: 12 })
  voucher_id: string;

  @ApiProperty()
  @Column("char", { length: 12 })
  user_id: string;

  @ApiProperty()
  @Column("char", { length: 12 })
  group_id: string;

  @ApiProperty()
  @Column("char", {
    length: 12,
  })
  employee_id: string;

  @ApiProperty()
  @Column({ type: "enum", enum: PayrollType })
  type: PayrollType;

  @ApiProperty()
  @Column({ type: "double" })
  amount: number;

  @ApiProperty()
  @Column({ type: "enum", enum: MonthList })
  month: MonthList;

}
