import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherEntryDto } from "src/voucher/dto/voucher.entry.dto";
import { VoucherService } from "src/voucher/service/voucher.service";
import { Repository, In } from "typeorm";
import { Payroll } from "../entities/payroll.entity";
import { PayrollDto } from "../dto/payroll.dto";
import { DrCr, IncomeTaxRule, MonthList, PayrollType } from "src/common/enums/all.enum";
import { CommonEntity } from "src/common/trait/entity.trait";
import { PayrollCreateDto } from "../dto/payroll.create.dto";
import { Generator } from "src/common/helpers/id.generator";
import { AnnualDeductionService } from "./annual.deduction.service";
import { CalculateTax } from "src/common/helpers/incometax.calculator";
import { EmployeeService } from "src/employees/service/employee.service";
import { SalaryPost, SalaryVoucher } from "src/common/interface/payrollVoucher";
import { LedgerService } from "src/ledgers/service/ledgers.service";
import { LedgerTypes } from "src/common/enums/ledger.group";
import { PayrollPost } from "../entities/payroll.post.entity";
import { PayrollPostDto } from "../dto/payroll.post.dto";
import { PayrollService } from "./payroll.service";
import { VoucherMeta } from "src/voucher/entities/voucher.meta.entity";
import { VoucherMetaDto } from "src/voucher/dto/voucher.meta.dto";

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


    async getPostEmployeeByMonth(employeeIds: string[], month: MonthList): Promise<PayrollPost[]> {
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

    async createSalaryPostByEmployeeId(payrollPostDto: PayrollPostDto, userId: string) {
        let employeedList = payrollPostDto.employees;
        const postGroupId = Generator.getId();
        if (payrollPostDto.all === "all") {
            employeedList = (await this.employeeService.getAllActiveEmployee()).map(e => e.id);
        }
        employeedList.forEach(async empid => {
            const voucher = await this.payrollService.getPayrollVoucherByEmployeeId(empid)
            if (voucher.plusTotal > 0) {
                //salary post for plus entry
                let narration = "Being salary posted for the month of " + payrollPostDto.month;
                await this.createPost(voucher.plus, payrollPostDto, narration, empid, postGroupId, userId, PayrollType.PLUS);
                //salary post for minus entry
                narration = "Being salary adjusted for the month of " + payrollPostDto.month;
                await this.createPost(voucher.minus, payrollPostDto, narration, empid, postGroupId, userId, PayrollType.MINUS);
            }
        })
    }

    async createPost(salaryVoucher: SalaryVoucher[], payrollPostDto: PayrollPostDto, narration: string, empId: string, postGroupId: string, userId: string, payrollType: PayrollType) {
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
        const voucherEntryDto: VoucherEntryDto = {
            crEntry: crEntry,
            drEntry: drEntry,
            transaction_date_en: payrollPostDto.transaction_date_en,
            transaction_date_np: payrollPostDto.transaction_date_np,
            narration: narration,
            validation: null
        }
        const voucherModel = await this.voucherService.payrollEntry(voucherEntryDto, userId)

        const payrollPostCreate = this.payrollPostRepository.create({
            account_id: voucherModel.account_id,
            amount: drEntry.reduce((total, current) => {
                return total + current.amount;
            }, 0),
            month: payrollPostDto.month,
            particular: voucherEntryDto.narration,
            type: payrollType,
            user_id: userId,
            voucher_id: voucherModel.id,
            employee_id: empId,
            group_id: postGroupId
        })
        return await this.payrollPostRepository.save(payrollPostCreate);
    }
}