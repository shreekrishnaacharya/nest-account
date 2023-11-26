import { Ledger } from "src/ledgers/entities/ledger.entity";
import { DrCr } from "../enums/all.enum";
import { Employee } from "src/employees/entities/employee.entity";

export interface SalaryVoucher {
    dr_cr: DrCr,
    ledger_id: string,
    ledger: Ledger,
    amount: number
}

export interface SalaryPost {
    employee: Employee,
    employee_id: string,
    plus: SalaryVoucher[],
    minus: SalaryVoucher[],
    plusTotal: number,
    minusTotal: number
}