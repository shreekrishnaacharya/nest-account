import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommonEntity } from "src/common/trait/entity.trait";
import { AnnualDeduction } from "../entities/annual.deduction.entity";
import { AnnualDeductionDto } from "../dto/annual.deduction.dto";
import { PayrollService } from "./payroll.service";
import { PayrollSetting } from "../entities/payroll.setting.entity";
import { PayrollSettingService } from "./payroll.setting.service";

@Injectable()
export class AnnualDeductionService extends CommonEntity<AnnualDeduction> {
  constructor(
    @InjectRepository(AnnualDeduction)
    private deductionRepository: Repository<AnnualDeduction>,
    @Inject(forwardRef(() => PayrollSettingService))
    private payrollSettingService: PayrollSettingService,
  ) {
    super(deductionRepository);
  }

  async getAnnualDeduction(employeeId: string): Promise<AnnualDeduction[]> {
    const paySetting = await this.payrollSettingService.getPayrollSetting();

    const deduction = await this.deductionRepository.find({
      where: { employee_id: employeeId },
      order: {
        createdAt: "DESC",
      },
    });
    const deductList = {};
    deduction.forEach(element => {
      deductList[element.ledger_id] = element;
    });
    return paySetting.map((e) => {
      if (e.ledger_id in deductList) {
        return deductList[e.ledger_id];
      }
      return this.deductionRepository.create({
        ledger_id: e.ledger_id,
        amount: 0,
        employee_id: employeeId
      })
    })
  }

  async getOneAnnualDeduction(id: string): Promise<AnnualDeduction> {
    return await this.deductionRepository.findOne({
      where: {
        id
      },
    });
  }

  async createDeduction(
    employeeId: string,
    payrollDto: AnnualDeductionDto,
  ): Promise<AnnualDeduction> {
    const {
      ledger_id,
      amount
    } = payrollDto;
    const payrollModel = this.deductionRepository.create({
      employee_id: employeeId,
      ledger_id,
      amount
    })
    return await this.deductionRepository.save(payrollModel);
  }

  async updateDeduction(
    payrollDto: AnnualDeductionDto,
    id: string,
  ) {
    await this.deductionRepository.findOne({
      where: { id }
    })
    const {
      ledger_id,
      amount
    } = payrollDto;
    const payrollModel = this.deductionRepository.create({
      ledger_id,
      amount
    })
    await this.deductionRepository.update(id, payrollModel)
  }


}
