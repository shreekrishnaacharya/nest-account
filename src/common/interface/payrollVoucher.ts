import { Ledger } from "src/ledgers/entities/ledger.entity";
import { DrCr } from "../enums/all.enum";

export interface SalaryVoucher {
    dr_cr: DrCr,
    ledger_id: string,
    ledger: Ledger,
    amount: number
}

export interface SalaryPost {
    employee_id: string,
    plus: SalaryVoucher[],
    minus: SalaryVoucher[]
}