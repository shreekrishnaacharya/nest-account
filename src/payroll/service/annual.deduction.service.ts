import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommonEntity } from "src/common/trait/entity.trait";
import { AnnualDeduction } from "../entities/annual.deduction.entity";
import { AnnualDeductionDto } from "../dto/annual.deduction.dto";
import { PayrollSettingService } from "./payroll.setting.service";
import { AnnualDeductionCreateDto } from "../dto/annual.deduction.create.dto";
import { Generator } from "src/common/helpers/id.generator";
import { PayrollService } from "./payroll.service";

@Injectable()
export class AnnualDeductionService extends CommonEntity<AnnualDeduction> {
  constructor(
    @InjectRepository(AnnualDeduction)
    private deductionRepository: Repository<AnnualDeduction>,
    @Inject(forwardRef(() => PayrollSettingService))
    private payrollSettingService: PayrollSettingService,
    @Inject(forwardRef(() => PayrollService))
    private payrollService: PayrollService,
  ) {
    super(deductionRepository);
  }

  async getAnnualDeduction(employeeId: string): Promise<AnnualDeduction[]> {
    const paySetting = await this.payrollSettingService.getPayrollSetting();
    const deduction = await this.deductionRepository.find({
      relations: { ledger: true },
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
        return { ...deductList[e.ledger_id], max_amount: e.max_amount };
      }
      return this.deductionRepository.create({
        ledger_id: e.ledger_id,
        amount: 0,
        employee_id: employeeId,
        ledger: e.ledger,
        max_amount: e.max_amount
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
    const annu = await this.deductionRepository.save(payrollModel);
    this.payrollService.employeeUpdateSalary(employeeId)
    return annu
  }

  async updateDeduction(
    payrollDto: AnnualDeductionDto,
    id: string,
  ) {
    const deduction = await this.deductionRepository.findOne({
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
    this.payrollService.employeeUpdateSalary(deduction.employee_id)
  }

  async updateAllDeduction(
    annualDeductionDto: AnnualDeductionCreateDto,
    employeeId: string,
  ) {
    const payrollModel = annualDeductionDto.annualDeduction.map(e => {
      return this.deductionRepository.create({
        id: Generator.getId(),
        ledger_id: e.ledger_id,
        amount: e.amount,
        employee_id: employeeId
      })
    })
    await this.deleteAllByEmployeeId(employeeId);
    await this.deductionRepository.insert(payrollModel)
    this.payrollService.employeeUpdateSalary(employeeId)
  }

  async deleteAllByEmployeeId(
    employeeId: string
  ) {
    await this.deductionRepository.delete({ employee_id: employeeId });
    this.payrollService.employeeUpdateSalary(employeeId)
  }

  async deleteAllByLedgerId(
    ledgerId: string
  ) {
    await this.deductionRepository.delete({ ledger_id: ledgerId });
    //update all employee salary with employee list and update method
    // this.payrollService.employeeUpdateSalary(employeeId)
  }

}
