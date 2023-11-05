import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherEntryDto } from "src/voucher/dto/voucher.entry.dto";
import { VoucherService } from "src/voucher/service/voucher.service";
import { Repository } from "typeorm";
import { Payroll } from "../entities/payroll.entity";
import { PayrollDto } from "../dto/payroll.dto";
import { PayrollType } from "src/common/enums/all.enum";
import { CommonEntity } from "src/common/trait/entity.trait";
import { PayrollSetting } from "../entities/payroll.setting.entity";
import { PayrollSettingDto } from "../dto/payroll.setting.dto";

@Injectable()
export class PayrollSettingService extends CommonEntity<PayrollSetting> {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<PayrollSetting>,
  ) {
    super(payrollRepository);
  }

  async getPayrollSetting(): Promise<PayrollSetting[]> {
    const invoices = await this.payrollRepository.find({
      order: {
        createdAt: "DESC",
      },
    });
    return invoices;
  }
  async createSetting(
    payrollDto: PayrollSettingDto,
  ): Promise<PayrollSetting> {
    const {
      ledger_id,
      max_amount
    } = payrollDto;
    const payrollModel = this.payrollRepository.create({
      ledger_id,
      max_amount,
    })
    return await this.payrollRepository.save(payrollModel);
  }

  async updatePayroll(
    payrollDto: PayrollSettingDto,
    id: string,
  ) {
    await this.payrollRepository.findOne({
      where: { id }
    })
    const {
      ledger_id,
      max_amount
    } = payrollDto;
    const payrollModel = this.payrollRepository.create({
      ledger_id,
      max_amount
    })
    await this.payrollRepository.update(id, payrollModel)
  }


}
