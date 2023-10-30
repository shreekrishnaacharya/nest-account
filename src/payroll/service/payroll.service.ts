import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherEntryDto } from "src/voucher/dto/voucher.entry.dto";
import { VoucherService } from "src/voucher/service/voucher.service";
import { Repository } from "typeorm";
import { Payroll } from "../entities/payroll.entity";
import { PayrollDto } from "../dto/payroll.dto";
import { PayrollType } from "src/common/enums/all.enum";

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    private voucherService: VoucherService
  ) { }
  async createPayroll(
    payrollDtos: PayrollDto[],
    employeeId: string,
    payrollType: PayrollType
  ) {
    payrollDtos.forEach(payrollDto => {
      const {
        ledger_id,
        amount
      } = payrollDto;
      const payrollModel = this.payrollRepository.create({
        employee_id: employeeId,
        ledger_id,
        amount,
        type: payrollType
      })
      this.payrollRepository.save(payrollModel);
    })
    //do bulk save operation here
  }

  async updatePayroll(
    payrollDtos: PayrollDto[],
    employeeId: string,
    payrollType: PayrollType
  ) {
    this.payrollRepository.find({
      where: { id: employeeId }
    })
    payrollDtos.forEach(payrollDto => {
      const {
        ledger_id,
        amount
      } = payrollDto;
      const payrollModel = this.payrollRepository.create({
        employee_id: employeeId,
        ledger_id,
        amount,
        type: payrollType
      })
      this.payrollRepository.save(payrollModel);
    })
    //do bulk save operation here
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

}
