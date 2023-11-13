import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherEntryDto } from "src/voucher/dto/voucher.entry.dto";
import { VoucherService } from "src/voucher/service/voucher.service";
import { Repository } from "typeorm";
import { Payroll } from "../entities/payroll.entity";
import { PayrollDto } from "../dto/payroll.dto";
import { PayrollType } from "src/common/enums/all.enum";
import { CommonEntity } from "src/common/trait/entity.trait";
import { PayrollCreateDto } from "../dto/payroll.create.dto";
import { Generator } from "src/common/helpers/id.generator";

@Injectable()
export class PayrollService extends CommonEntity<Payroll> {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
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
    this.payrollRepository.insert(payrollModel);
  }

  async getOnePayroll(
    payrollId: string
  ) {
    return await this.payrollRepository.findOneOrFail({
      where: { id: payrollId }
    })
  }

  async updatePayroll(
    payrollId: string,
    payrollDto: PayrollDto,
    employeeId: string
  ) {
    await this.payrollRepository.findOneOrFail({
      where: { employee_id: employeeId }
    })
    const {
      ledger_id,
      amount,
      type
    } = payrollDto;
    const payrollModel = this.payrollRepository.create({
      employee_id: employeeId,
      ledger_id,
      amount,
      type
    })
    this.payrollRepository.update(payrollId, payrollModel);
  }

  async deletePayroll(
    payrollId: string,
  ) {
    await this.payrollRepository.delete(payrollId)
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
