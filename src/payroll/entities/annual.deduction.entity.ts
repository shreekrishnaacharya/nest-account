import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class AnnualDeduction extends BaseEntity {


    @ApiProperty()
    @Column("char", { length: 12 })
    ledger_id: string;

    @ApiProperty()
    @Column("char", {
        length: 12,
    })
    employee_id: string;

    @ApiProperty()
    @Column({ type: "double" })
    amount: number;

}
