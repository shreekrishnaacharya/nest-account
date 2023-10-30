import { ApiProperty } from "@nestjs/swagger";
import { MonthList } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity } from "typeorm";

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
  @Column("char", {
    length: 12,
  })
  employee_id: string;

  @ApiProperty()
  @Column({ type: "double" })
  plus_amount: number;

  @ApiProperty()
  @Column({ type: "double" })
  minus_amount: number;

  @ApiProperty()
  @Column({ type: "enum", enum: MonthList })
  type: MonthList;

}
