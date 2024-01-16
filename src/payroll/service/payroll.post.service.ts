import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherEntryDto } from "src/voucher/dto/voucher.entry.dto";
import { VoucherService } from "src/voucher/service/voucher.service";
import { Repository, In } from "typeorm";
import { DrCr, MonthList, PayrollType } from "src/common/enums/all.enum";
import { CommonEntity } from "src/common/trait/entity.trait";
import { Generator } from "src/common/helpers/id.generator";
import { EmployeeService } from "src/employees/service/employee.service";
import { CreatePayrollPost, SalaryVoucher } from "src/common/interface/payrollVoucher";
import { PayrollPost } from "../entities/payroll.post.entity";
import { PayrollPostDto } from "../dto/payroll.post.dto";
import { PayrollService } from "./payroll.service";
import { VoucherMetaDto } from "src/voucher/dto/voucher.meta.dto";
import { PayrollEntryDto } from "../dto/payroll.entry.dto";
import { throwError } from "rxjs";
import { PayrollEntryMetaDto } from "../dto/payroll.entry.meta.dto";
import NepaliDate from 'nepali-date-converter'

@Injectable()
export class PayrollPostService extends CommonEntity<PayrollPost> {
    constructor(
        @InjectRepository(PayrollPost)
        private payrollPostRepository: Repository<PayrollPost>,
        @Inject(forwardRef(() => EmployeeService))
        private employeeService: EmployeeService,
        @Inject(forwardRef(() => PayrollService))
        private payrollService: PayrollService,
        @Inject(forwardRef(() => VoucherService))
        private voucherService: VoucherService
    ) {
        super(payrollPostRepository);
    }

    async getPostEmployeeByEmpId(employeeId: string, month?: MonthList): Promise<PayrollPost[]> {
        const invoices = await this.payrollPostRepository.find({
            where: {
                employee_id: employeeId,
                month: month
            },
            order: {
                createdAt: "DESC",
            },
        });
        return invoices;
    }

    async getPostEmployeeByEmpIdAndMonth(employeeIds: string[], month?: MonthList): Promise<PayrollPost[]> {
        const invoices = await this.payrollPostRepository.find({
            where: {
                employee_id: In(employeeIds),
                month: month
            },
            order: {
                createdAt: "DESC",
            },
        });
        return invoices;
    }


    async createSalaryPostByEmployeeId(employeeId: string, payrollEntry: PayrollEntryDto, userId: string): Promise<Boolean> {

        const salaryVoucher: SalaryVoucher[] = [];
        const employeeModel = await this.employeeService.getEmployeeById(employeeId);
        let payrollType = PayrollType.PLUS
        if ("drEntry" in payrollEntry) {
            
            let total = 0;
            payrollEntry.drEntry.forEach((e) => {
                total += e.amount;
                salaryVoucher.push({
                    amount: e.amount,
                    dr_cr: DrCr.DR,
                    ledger_id: e.ledger_id,
                    ledger: null
                })
            })
            salaryVoucher.push({
                amount: total,
                dr_cr: DrCr.CR,
                ledger_id: employeeModel.ledger_id,
                ledger: null
            })
        } else if ("crEntry" in payrollEntry) {
            payrollType = PayrollType.MINUS
            let total = 0;
            const crEntry = payrollEntry as PayrollEntryDto & { crEntry: PayrollEntryMetaDto[] };
            salaryVoucher.push({
                amount: crEntry.crEntry.reduce((pre: any, current: any) => {
                    return pre + current.amount
                }, 0),
                dr_cr: DrCr.DR,
                ledger_id: employeeModel.ledger_id,
                ledger: null
            })

            crEntry.crEntry.forEach((e) => {
                total += e.amount;
                salaryVoucher.push({
                    amount: e.amount,
                    dr_cr: DrCr.CR,
                    ledger_id: e.ledger_id,
                    ledger: null
                })
            })

        } else {
            new Error("Invalid form");
        }

        await this.createPost(salaryVoucher, {
            payrollType: payrollType,
            transaction_date_en: payrollEntry.transaction_date_en,
            transaction_date_np: payrollEntry.transaction_date_np,
            narration: payrollEntry.narration,
            empId: employeeId,
            postGroupId: Generator.getId(),
        }, userId);
        return true;
    }

    async createSalaryReleaseByEmployeeId(payrollPostDto: PayrollPostDto, userId: string) {
        let employeedList = payrollPostDto.employees;
        const postGroupId = Generator.getId();
        if (payrollPostDto.all === "all") {
            employeedList = (await this.employeeService.getAllActiveEmployee()).map(e => e.id);
        }
        employeedList.forEach(async empid => {
            const voucher = await this.payrollService.getPayrollVoucherByEmployeeId(empid)
            if (voucher.plusTotal > 0) {
                //salary post for plus entry
                await this.createPost(voucher.plus, {
                    payrollType: PayrollType.PLUS,
                    transaction_date_en: payrollPostDto.transaction_date_en,
                    transaction_date_np: payrollPostDto.transaction_date_np,
                    empId: empid,
                    postGroupId,
                }, userId, postGroupId);
                //salary post for minus entry
                await this.createPost(voucher.minus, {
                    payrollType: PayrollType.MINUS,
                    transaction_date_en: payrollPostDto.transaction_date_en,
                    transaction_date_np: payrollPostDto.transaction_date_np,
                    empId: empid,
                    postGroupId,
                }, userId, postGroupId);
            }
        })
    }

    async createPost(salaryVoucher: SalaryVoucher[], createPayrollPost: CreatePayrollPost, userId: string, voucherGroupId?: string) {
        //salary post for minus entry
        const drEntry = salaryVoucher.filter(e => e.dr_cr === DrCr.DR).map((vp): VoucherMetaDto => {
            return {
                amount: vp.amount,
                narration: null,
                ledger_id: vp.ledger_id,
                reference_date: null,
                reference_no: null
            }
        })
        const crEntry = salaryVoucher.filter(e => e.dr_cr === DrCr.CR).map((vp): VoucherMetaDto => {
            return {
                amount: vp.amount,
                narration: null,
                ledger_id: vp.ledger_id,
                reference_date: null,
                reference_no: null
            }
        })
        let narration = createPayrollPost.narration;
        if (createPayrollPost.narration == undefined) {
            if (createPayrollPost.payrollType == PayrollType.PLUS) {
                narration = "Being salary posted for the month";
            } else {
                narration = "Being salary adjusted for the month";
            }
        }
        const voucherEntryDto: VoucherEntryDto = {
            crEntry: crEntry,
            drEntry: drEntry,
            transaction_date_en: createPayrollPost.transaction_date_en,
            transaction_date_np: createPayrollPost.transaction_date_np,
            narration: narration,
            validation: null
        }
        const voucherModel = await this.voucherService.payrollEntry(voucherEntryDto, userId, voucherGroupId)

        const payrollPostCreate = this.payrollPostRepository.create({
            account_id: voucherModel.account_id,
            amount: drEntry.reduce((total, current) => {
                return total + current.amount;
            }, 0),
            particular: voucherEntryDto.narration,
            type: createPayrollPost.payrollType,
            user_id: userId,
            voucher_id: voucherModel.id,
            employee_id: createPayrollPost.empId,
            group_id: createPayrollPost.postGroupId
        })
        return await this.payrollPostRepository.save(payrollPostCreate);
    }

}