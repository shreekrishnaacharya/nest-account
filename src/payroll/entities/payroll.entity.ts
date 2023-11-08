import { ApiProperty } from "@nestjs/swagger";
import { PayrollType, Status, YesNo } from "src/common/enums/all.enum";
import { BaseEntity } from "src/database/entities/base.entity";
import { Employee } from "src/employees/entities/employee.entity";
import { Ledger } from "src/ledgers/entities/ledger.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Payroll extends BaseEntity {
  @ApiProperty()
  @Column("char", { length: 12 })
  employee_id: string;

  @ApiProperty()
  @Column("char", { length: 12 })
  ledger_id: string;

  @ApiProperty()
  @Column({ type: "enum", enum: PayrollType })
  type: PayrollType;

  @ApiProperty()
  @Column({ type: 'double' })
  amount: number;

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
  status: Status;

  @ApiProperty()
  @ManyToOne(() => Ledger, (ledger: Ledger) => ledger.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ledger_id" })
  ledger: () => Ledger;

  @ApiProperty()
  @ManyToOne(() => Employee, (employee: Employee) => employee.id, {
    onDelete: "CASCADE",
    lazy: true,
  })
  @JoinColumn({ name: "employee_id" })
  employee: () => Employee;
}
