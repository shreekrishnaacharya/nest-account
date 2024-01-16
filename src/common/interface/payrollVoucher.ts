import { Ledger } from "src/ledgers/entities/ledger.entity";
import { DrCr, MonthList, PayrollType } from "../enums/all.enum";
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

export interface CreatePayrollPost {
    transaction_date_en: string;
    transaction_date_np: string;
    narration?: string;
    month?: MonthList;
    empId: string;
    postGroupId: string
    payrollType: PayrollType
}