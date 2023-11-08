import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommonEntity } from "src/common/trait/entity.trait";
import { AnnualDeduction } from "../entities/annual.deduction";
import { AnnualDeductionDto } from "../dto/annual.deduction.dto";

@Injectable()
export class AnnualDeductionService extends CommonEntity<AnnualDeduction> {
  constructor(
    @InjectRepository(AnnualDeduction)
    private deductionRepository: Repository<AnnualDeduction>,
  ) {
    super(deductionRepository);
  }

  async getAnnualDeduction(employeeId: string): Promise<AnnualDeduction[]> {
    return await this.deductionRepository.find({
      where: { employee_id: employeeId },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getOneAnnualDeduction(id: string): Promise<AnnualDeduction> {
    return await this.deductionRepository.findOne({
      where: {
        id
      },
    });
  }
  async createSetting(
    payrollDto: AnnualDeductionDto,
  ): Promise<AnnualDeduction> {
    console.log(payrollDto)
    const {
      ledger_id,
      amount
    } = payrollDto;
    const payrollModel = this.deductionRepository.create({
      ledger_id,
      amount
    })
    return await this.deductionRepository.save(payrollModel);
  }

  async updatePayroll(
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
