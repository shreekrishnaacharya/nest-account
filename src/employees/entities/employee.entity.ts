import { ApiProperty } from "@nestjs/swagger";
import { EmploymentType, Gender, MarriedStatus, Status } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { Ledger } from "src/ledgers/entities/ledger.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Employee extends BaseEntity {

    @ApiProperty()
    @Column({ length: 100 })
    name: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null, length: 30 })
    email: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null, length: 20 })
    phone1: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null, length: 20 })
    phone2: string;

    @ApiProperty()
    @Column({ nullable: true, default: null, length: 100 })
    img: string;

    @ApiProperty()
    @Column({ type: "enum", enum: Gender })
    gender: Gender;

    @ApiProperty()
    @Column({ type: "enum", enum: EmploymentType })
    employment: EmploymentType;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null, length: 50 })
    type: string;

    @ApiProperty()
    @Column({ nullable: true, default: null, length: 10 })
    dob_np: string;

    @ApiProperty({ type: Date })
    @Column({ type: "date" })
    dob_en: Date;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null, length: 10 })
    doj_np: string;

    @ApiProperty({ nullable: true, default: null, type: Date })
    @Column({ type: "date" })
    doj_en: Date;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null, length: 30 })
    bank_no: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    address1: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    address2: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null, type: "text" })
    qualification: string;

    @Column({ type: "char", length: 12 })
    ledger_id: string;

    @ApiProperty()
    @Column({ type: "enum", enum: Status })
    status: Status;

    @ApiProperty()
    @Column({ type: "enum", enum: MarriedStatus, default: MarriedStatus.UNMARRIED })
    married: MarriedStatus;

    @ApiProperty()
    @Column({ default: 0 })
    amount_plus: number;

    @ApiProperty()
    @Column({ default: 0 })
    amount_minus: number;

    @ManyToOne(() => Ledger, (ledger) => ledger.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "ledger_id" })
    ledger: Ledger;
}
