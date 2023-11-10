import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommonEntity } from "src/common/trait/entity.trait";
import { PayrollSetting } from "../entities/payroll.setting.entity";
import { PayrollSettingDto } from "../dto/payroll.setting.dto";
import { LedgerService } from "src/ledgers/service/ledgers.service";
import { LedgerTypes } from "src/common/enums/ledger.group";

@Injectable()
export class PayrollSettingService extends CommonEntity<PayrollSetting> {
  constructor(
    @InjectRepository(PayrollSetting)
    private payrollRepository: Repository<PayrollSetting>,
    @Inject(forwardRef(() => LedgerService))
    private ledgerService: LedgerService,
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

  async getOnePayrollSetting(id: string): Promise<PayrollSetting> {
    return await this.payrollRepository.findOne({
      where: {
        id
      },
    });
  }

  async createSetting(
    payrollDto: PayrollSettingDto,
  ): Promise<PayrollSetting> {
    console.log(payrollDto)
    const {
      ledger_id,
      max_amount
    } = payrollDto;
    const payrollModel = this.payrollRepository.create({
      ledger_id,
      max_amount
    })
    const ledgerDto: any = { type: LedgerTypes.PAYROLL_ANNUAL_DEDUCTION };
    this.ledgerService.updateLedger(ledger_id, ledgerDto)
    return await this.payrollRepository.save(payrollModel);
  }

  async updateSetting(
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

  async deletePayroll(
    id: string,
  ) {
    // const settingPay = await this.payrollRepository.findOne({
    //   where: { id }
    // })
    await this.payrollRepository.delete(id)
    // const ledgerDto: any = { type: LedgerTypes.PAYROLL_ANNUAL_DEDUCTION };
    // this.ledgerService.updateLedger(settingPay.ledger_id, ledgerDto)
    return true;
  }


}
