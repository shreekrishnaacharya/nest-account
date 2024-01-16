import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/database/entities/base.entity";
import { Ledger } from "src/ledgers/entities/ledger.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";

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
    @Column({ type: "double" , precision: 10, scale: 2})
    amount: number;

    @ApiProperty()
    max_amount: number


    @ApiProperty()
    @ManyToOne(() => Ledger, (ledger: Ledger) => ledger.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "ledger_id" })
    ledger: Ledger;
}
