import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherEntryDto } from "src/voucher/dto/voucher.entry.dto";
import { VoucherService } from "src/voucher/service/voucher.service";
import { Repository } from "typeorm";
import { Payroll } from "../entities/payroll.entity";
import { PayrollDto } from "../dto/payroll.dto";
import { DrCr, IncomeTaxRule, PayrollType } from "src/common/enums/all.enum";
import { CommonEntity } from "src/common/trait/entity.trait";
import { PayrollCreateDto } from "../dto/payroll.create.dto";
import { Generator } from "src/common/helpers/id.generator";
import { AnnualDeductionService } from "./annual.deduction.service";
import { CalculateTax } from "src/common/helpers/incometax.calculator";
import { EmployeeService } from "src/employees/service/employee.service";
import { SalaryPost, SalaryVoucher } from "src/common/interface/payrollVoucher";
import { LedgerService } from "src/ledgers/service/ledgers.service";
import { LedgerTypes } from "src/common/enums/ledger.group";

@Injectable()
export class PayrollService extends CommonEntity<Payroll> {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @Inject(forwardRef(() => AnnualDeductionService))
    private annualService: AnnualDeductionService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(forwardRef(() => LedgerService))
    private ledgerService: LedgerService,
    @Inject(forwardRef(() => VoucherService))
    private voucherService: VoucherService
  ) {
    super(payrollRepository);
  }
  async createPayroll(
    payrollDtos: PayrollCreateDto,
    employeeId: string
  ) {
    let payrollModel = {}
    payrollDtos.payroll.forEach(payrollDto => {
      const {
        ledger_id,
        amount,
        type
      } = payrollDto;

      payrollModel[ledger_id] = this.payrollRepository.create({
        id: Generator.getId(),
        employee_id: employeeId,
        ledger_id,
        amount,
        type
      })

    })
    await this.payrollRepository.insert(Object.values(payrollModel));
    this.employeeUpdateSalary(employeeId)
  }

  async getOnePayroll(
    payrollId: string
  ) {
    return await this.payrollRepository.findOneOrFail({
      where: { id: payrollId }
    })
  }

  async getSummary(
    employeeId: string
  ) {
    const salaryAmount = await this.payrollRepository.sum("amount", { employee_id: employeeId, type: PayrollType.PLUS }) * 12
    const salaryMAmount = await this.payrollRepository.sum("amount", { employee_id: employeeId, type: PayrollType.MINUS }) * 12
    const annualList = await this.annualService.getAnnualDeduction(employeeId);
    const annualAmount = annualList.reduce((total, annual) => {
      return annual.amount > annual.max_amount ? annual.max_amount + total : annual.amount + total;
    }, 0)
    const taxable = (salaryAmount) - annualAmount
    const taxAmount = CalculateTax(IncomeTaxRule.Y7980, taxable)
    const inhand = taxable - (salaryMAmount) - taxAmount;
    const totalDeduction = (salaryMAmount) + annualAmount + taxAmount;
    const grossSalary = taxable - totalDeduction
    return { salaryAmount, annualDeduction: annualAmount, taxable, taxAmount, totalDeduction, inhand, grossSalary }
  }

  async updatePayroll(
    payrollId: string,
    amount: number,
    employeeId: string
  ) {
    await this.payrollRepository.findOneOrFail({
      where: { id: payrollId }
    })
    const payrollModel = this.payrollRepository.create({
      id: payrollId,
      amount
    })
    await this.payrollRepository.save(payrollModel);
  }

  async deletePayroll(
    payrollId: string,
  ) {
    const empPayroll = await this.payrollRepository.findOneOrFail({
      where: { id: payrollId }
    })
    await this.payrollRepository.delete(payrollId)
    this.employeeUpdateSalary(empPayroll.employee_id)
  }

  async employeeUpdateSalary(employeeId: string) {
    const salaryAmount = await this.payrollRepository.sum("amount", { employee_id: employeeId, type: PayrollType.PLUS })
    const salaryMAmount = await this.payrollRepository.sum("amount", { employee_id: employeeId, type: PayrollType.MINUS })
    const annualList = await this.annualService.getAnnualDeduction(employeeId);
    const annualAmount = annualList.reduce((total, annual) => {
      return annual.amount + total
    }, 0)
    const taxable = (salaryAmount * 12) - (annualAmount)
    const taxAmount = CalculateTax(IncomeTaxRule.Y7980, taxable)
    const totalDeduction = ((annualAmount + taxAmount) / 12) + salaryMAmount;
    this.employeeService.updateEmployeeMonthlySalary(employeeId, salaryAmount, totalDeduction);
  }

  async getPayroll(employeeId: string): Promise<Payroll[]> {
    const invoices = await this.payrollRepository.find({
      where: {
        employee_id: employeeId
      },
      order: {
        createdAt: "DESC",
      },
    });
    return invoices;
  }

  async getPayrollVoucherByEmployeeId(employeeId: string): Promise<SalaryPost> {
    const employeeModel = await this.employeeService.getEmployeeById(employeeId);
    const incomeTaxModel = await this.ledgerService.getOneLedgerByType(LedgerTypes.INCOME_TAX)
    const payroll = await this.payrollRepository.find({
      relations: { ledger: true },
      where: {
        employee_id: employeeId
      },
      order: {
        type: "DESC",
      },
    });
    const voucherDetail: SalaryPost = {
      employee_id: employeeId,
      employee: employeeModel,
      plus: [],
      minus: [],
      plusTotal: 0,
      minusTotal: 0
    };
    let drTotal = 0, crTotal = 0;
    payroll.forEach((e) => {
      if (PayrollType.MINUS == e.type) {
        voucherDetail.minus.push({
          dr_cr: DrCr.DR,
          ledger: e.ledger,
          ledger_id: e.ledger_id,
          amount: e.amount
        })
        drTotal += e.amount;
      } else {
        voucherDetail.plus.push({
          dr_cr: DrCr.CR,
          ledger: e.ledger,
          ledger_id: e.ledger_id,
          amount: e.amount
        })
        crTotal += e.amount;
      }
    })
    const annualList = await this.annualService.getAnnualDeduction(employeeId);
    annualList.forEach((e) => {
      const amt = parseFloat((e.amount / 12).toFixed(2))
      voucherDetail.minus.push({
        dr_cr: DrCr.DR,
        ledger: e.ledger,
        ledger_id: e.ledger_id,
        amount: amt
      })
      drTotal += amt
    })
    voucherDetail.plus.push({
      dr_cr: DrCr.DR,
      ledger: employeeModel.ledger,
      ledger_id: employeeModel.ledger_id,
      amount: crTotal
    })


    const annualAmount = annualList.reduce((total, annual) => {
      return annual.amount + total
    }, 0)
    const taxable = (crTotal * 12) - (annualAmount)
    const taxAmount = parseFloat((CalculateTax(IncomeTaxRule.Y7980, taxable) / 12).toFixed(2))
    drTotal += taxAmount;
    voucherDetail.minus.push({
      dr_cr: DrCr.DR,
      ledger: incomeTaxModel,
      ledger_id: incomeTaxModel.id,
      amount: taxAmount
    })

    voucherDetail.minus.push({
      dr_cr: DrCr.CR,
      ledger: employeeModel.ledger,
      ledger_id: employeeModel.ledger_id,
      amount: drTotal
    })
    voucherDetail.minusTotal = drTotal
    voucherDetail.plusTotal = crTotal
    return voucherDetail
  }

}