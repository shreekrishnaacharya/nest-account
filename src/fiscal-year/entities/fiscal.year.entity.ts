import { ApiProperty } from "@nestjs/swagger";
import { Status, YesNo } from "src/common/enums/all.enum";
import { BaseMinEntity } from "src/database/entities/base.min.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class FiscalYear extends BaseMinEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  opening_np: string;

  @ApiProperty()
  @Column()
  closing_np: string;

  @ApiProperty()
  @Column()
  opening_en: string;

  @ApiProperty()
  @Column()
  closing_en: string;

  @ApiProperty({
    enum: YesNo,
    type: "enum",
    nullable: false,
    default: YesNo.YES,
  })
  @Column({ enum: YesNo, type: "enum", nullable: false, default: YesNo.YES })
  is_closed: YesNo;

  @ApiProperty()
  @Column("char", { nullable: true, length: 12 })
  previous_year: string;

  @ApiProperty()
  @Column()
  bill_no: number;

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
  is_active: Status;

  // @OneToMany(() => Voucher, (voucher: Voucher) => voucher.fiscal_year_id)
  // vouchers: Voucher[];
}
