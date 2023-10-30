import { ApiProperty } from "@nestjs/swagger";
import { EmploymentType, Gender } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Employee extends BaseEntity {
    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    email: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    phone_1: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    phone_2: string;

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
    @Column()
    type: string;

    @ApiProperty()
    @Column()
    dob_np: string;

    @ApiProperty({ type: Date })
    @Column()
    dob_en: Date;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    doj_np: string;

    @ApiProperty({ nullable: true, default: null, type: Date })
    @Column()
    doj_en: Date;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    bank_no: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    address1: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null })
    address2: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true, default: null, type: "longtext" })
    qualification: string;

    @Column()
    ledger_id: string;
}
